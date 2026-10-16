import { IMainApi } from "@shared/api";
import type {
  IAgentInstallOptionsDto,
  IAgentIssuedEnvDto,
  IAgentIssuedLinkDto,
  NodeDto,
} from "@shared/api/gen/main/model";
import { useEntity } from "@shared/lib/holders";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { downloadBlob } from "@shared/lib/utils";
import { useZodForm } from "@shared/ui";
import { useRef, useState } from "react";

import {
  DEFAULT_ISSUE_MINUTES,
  issueAgentSchema,
  issueBody,
  type TIssueAgentValues,
} from "./validation";

type TIssueKind = "archive" | "link" | "env";

/** Кому выдаём агента: узлу (токен с меткой узла) или просто агента (раздел агентов). */
export type TIssueTarget = { node: NodeDto } | { node?: undefined };

/**
 * Выдача агента получателю: архив агента (все платформы) с `.env` (адрес, одноразовый токен,
 * имя) — файлом или одноразовой ссылкой, либо только `.env` (для общего архива или образа).
 * Что в архиве (платформы, есть ли запуск в Docker) — с сервера.
 */
export const useIssueAgentVM = (target: TIssueTarget) => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();
  const [link, setLink] = useState<IAgentIssuedLinkDto | null>(null);
  const [env, setEnv] = useState<IAgentIssuedEnvDto | null>(null);
  const [busy, setBusy] = useState<TIssueKind | null>(null);
  const busyRef = useRef<TIssueKind | null>(null);
  const form = useZodForm(issueAgentSchema, {
    defaultValues: {
      name: target.node?.name ?? "",
      expiresInMinutes: DEFAULT_ISSUE_MINUTES,
      maxUses: 1,
      baseUrl: "",
    },
  });
  const nodeId = target.node?.id;

  const installOptions = useEntity<IAgentInstallOptionsDto>({
    queryFn: async () => {
      const res = await api.getAgentInstallOptions();

      if (res.error) notifyApiError(toast, res.error);

      return res;
    },
    autoLoad: true,
  });

  /** Одна выдача за раз: пока идёт любая, остальные не запускаются. */
  const run = async <T>(
    kind: TIssueKind,
    request: () => Promise<{ data?: T; error?: unknown }>,
  ): Promise<T | null> => {
    if (busyRef.current) return null;
    busyRef.current = kind;
    setBusy(kind);
    try {
      const res = await request();

      if (res.error) {
        notifyApiError(toast, res.error);

        return null;
      }

      return res.data ?? null;
    } finally {
      busyRef.current = null;
      setBusy(null);
    }
  };

  const downloadArchive = async (data: TIssueAgentValues) => {
    const body = issueBody(data);
    const blob = await run<unknown>("archive", () =>
      nodeId
        ? api.issueNodeAgentArchive(nodeId, body, { responseType: "blob" })
        : api.issueAgentArchive(
            { ...body, maxUses: data.maxUses },
            { responseType: "blob" },
          ),
    );

    if (!blob) return;
    if (!(blob instanceof Blob)) {
      toast.error("Сервер вернул не архив");

      return;
    }
    downloadBlob(blob, installOptions.data?.archive?.file ?? "agent.tar.gz");
    toast.success("Токен в архиве одноразовый — передайте архив получателю", {
      title: "Архив с токеном скачан",
    });
  };

  const createLink = async (data: TIssueAgentValues) => {
    const body = issueBody(data);
    const created = await run<IAgentIssuedLinkDto>("link", () =>
      nodeId
        ? api.issueNodeAgentLink(nodeId, body)
        : api.issueAgentLink({ ...body, maxUses: data.maxUses }),
    );

    if (created) setLink(created);
  };

  const createEnv = async (data: TIssueAgentValues) => {
    const body = issueBody(data);
    const issued = await run<IAgentIssuedEnvDto>("env", () =>
      nodeId
        ? api.issueNodeAgentEnv(nodeId, body)
        : api.issueAgentEnv({ ...body, maxUses: data.maxUses }),
    );

    if (issued) setEnv(issued);
  };

  const downloadEnv = () => {
    if (env) downloadBlob(new Blob([env.env], { type: "text/plain" }), ".env");
  };

  return {
    form,
    /** Варианты установки с сервера; геттер — чтение из observable холдера. */
    get options() {
      return installOptions.data;
    },
    forNode: !!nodeId,
    busy,
    link,
    env,
    downloadArchive,
    createLink,
    createEnv,
    downloadEnv,
  };
};

export type IssueAgentVM = ReturnType<typeof useIssueAgentVM>;
