import { IMainApi } from "@shared/api";
import type {
  IAgentInstallOptionsDto,
  IAgentIssuedEnvDto,
  IAgentIssuedLinkDto,
  NodeDto,
} from "@shared/api/gen/main/model";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { downloadBlob } from "@shared/lib/utils";
import { useZodForm } from "@shared/ui";
import { useEffect, useState } from "react";

import {
  DEFAULT_ISSUE_MINUTES,
  issueAgentSchema,
  issueBody,
  type TIssueAgentValues,
} from "./validation";

/** Кому выдаём агента: узлу (токен с меткой узла) или просто агента (раздел агентов). */
export type TIssueTarget = { node: NodeDto } | { node?: undefined };

/**
 * Выдача агента получателю: архив под платформу с `.env` (адрес, одноразовый токен, имя) —
 * файлом или одноразовой ссылкой, либо только `.env` (для общего архива или образа).
 * Варианты (платформы, есть ли запуск в Docker) — с сервера.
 */
export const useIssueAgentVM = (target: TIssueTarget) => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();
  const [options, setOptions] = useState<IAgentInstallOptionsDto | null>(null);
  const [link, setLink] = useState<IAgentIssuedLinkDto | null>(null);
  const [env, setEnv] = useState<IAgentIssuedEnvDto | null>(null);
  const [busy, setBusy] = useState<"archive" | "link" | "env" | null>(null);
  const form = useZodForm(issueAgentSchema, {
    defaultValues: {
      platform: "",
      name: target.node?.name ?? "",
      expiresInMinutes: DEFAULT_ISSUE_MINUTES,
      maxUses: 1,
      baseUrl: "",
    },
  });
  const nodeId = target.node?.id;

  useEffect(() => {
    let alive = true;

    void api.getAgentInstallOptions().then(res => {
      if (!alive) return;
      if (res.error) {
        notifyApiError(toast, res.error);

        return;
      }
      setOptions(res.data);
      const first =
        res.data.archives.find(a => a.platform === "linux-amd64") ??
        res.data.archives[0];

      if (first && !form.getValues("platform")) {
        form.setValue("platform", first.platform);
      }
    });

    return () => {
      alive = false;
    };
  }, [api, toast, form]);

  const archiveOf = (platform: string) =>
    options?.archives.find(a => a.platform === platform);

  const run = async <T>(
    kind: "archive" | "link" | "env",
    request: () => Promise<{ data?: T; error?: unknown }>,
  ): Promise<T | null> => {
    setBusy(kind);
    try {
      const res = await request();

      if (res.error) {
        notifyApiError(toast, res.error as never);

        return null;
      }

      return res.data ?? null;
    } finally {
      setBusy(null);
    }
  };

  const downloadArchive = async (data: TIssueAgentValues) => {
    const platform = data.platform as never;
    const body = { ...issueBody(data), platform };
    const blob = await run<unknown>("archive", () =>
      nodeId
        ? api.issueNodeAgentArchive(nodeId, body, { responseType: "blob" })
        : api.issueAgentArchive(
            { ...body, maxUses: data.maxUses },
            { responseType: "blob" },
          ),
    );

    if (!blob) return;
    downloadBlob(
      blob as Blob,
      archiveOf(data.platform)?.file ?? `agent-${data.platform}.tar.gz`,
    );
    toast.success("Токен в архиве одноразовый — передайте архив получателю", {
      title: "Архив с токеном скачан",
    });
  };

  const createLink = async (data: TIssueAgentValues) => {
    const platform = data.platform as never;
    const body = { ...issueBody(data), platform };
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
    options,
    archiveOf,
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
