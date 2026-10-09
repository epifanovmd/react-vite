import { IMainApi } from "@shared/api";
import type {
  INodeInstallCommandDto,
  NodeDto,
} from "@shared/api/gen/main/model";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { useZodForm } from "@shared/ui";
import { useState } from "react";

import {
  installCommandSchema,
  splitList,
  sshBody,
  sshSchema,
  type TInstallCommandValues,
  type TSshValues,
} from "./validation";

/** Что делаем с агентом: ставим или удаляем. */
export type TProvisionMode = "install" | "uninstall";

/** Способ установки: команда на узле или вход сервера по SSH. */
export type TInstallWay = "command" | "ssh";

/** Срок одноразового токена по умолчанию — сутки. */
const DEFAULT_EXPIRES_MINUTES = 1440;

interface UseProvisionNodeAgentOptions {
  /** Задача установки или удаления поставлена. */
  onStarted?: (jobId: string) => void;
}

/**
 * Установка и удаление агента узла. Установка — командой на узле
 * (одноразовый токен с меткой узла) или сервером по SSH; удаление — по SSH.
 * SSH-данные уходят в задачу один раз и в открытом виде не хранятся.
 */
export const useProvisionNodeAgentVM = ({
  onStarted,
}: UseProvisionNodeAgentOptions = {}) => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();
  const [node, setNode] = useState<NodeDto | null>(null);
  const [mode, setMode] = useState<TProvisionMode>("install");
  const [way, setWay] = useState<TInstallWay>("command");
  const [command, setCommand] = useState<INodeInstallCommandDto | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const commandForm = useZodForm(installCommandSchema, {
    defaultValues: {
      expiresInMinutes: DEFAULT_EXPIRES_MINUTES,
      baseUrl: "",
      workers: "",
    },
  });
  const sshForm = useZodForm(sshSchema);

  const openFor = (target: NodeDto, nextMode: TProvisionMode = "install") => {
    setMode(nextMode);
    setWay(nextMode === "install" && target.host ? "ssh" : "command");
    setCommand(null);
    setJobId(null);
    commandForm.reset({
      expiresInMinutes: DEFAULT_EXPIRES_MINUTES,
      baseUrl: "",
      workers: "",
    });
    sshForm.reset({
      host: target.host ?? "",
      port: 22,
      username: "root",
      auth: "password",
      password: "",
      privateKey: "",
      passphrase: "",
      sudo: true,
      backendUrl: "",
      workers: "",
      purge: false,
    });
    setNode(target);
  };

  const close = () => setNode(null);

  const createCommand = async (data: TInstallCommandValues) => {
    if (!node) return;

    const workers = splitList(data.workers);
    const res = await api.createNodeInstallCommand(node.id, {
      expiresInMinutes: data.expiresInMinutes,
      baseUrl: data.baseUrl || undefined,
      workers: workers.length ? workers : undefined,
    });

    if (res.error) {
      notifyApiError(toast, res.error);

      return;
    }

    setCommand(res.data);
  };

  const submitSsh = async (data: TSshValues) => {
    if (!node) return;

    const workers = splitList(data.workers);
    const res =
      mode === "uninstall"
        ? await api.uninstallNodeAgent(node.id, {
            ...sshBody(data),
            purge: data.purge,
          })
        : await api.installNodeAgent(node.id, {
            ...sshBody(data),
            workers: workers.length ? workers : undefined,
          });

    if (res.error) {
      notifyApiError(toast, res.error);

      return;
    }

    setJobId(res.data.jobId);
    toast.success("Ход виден на карточке узла и в задачах", {
      title: mode === "uninstall" ? "Удаление запущено" : "Установка запущена",
    });
    onStarted?.(res.data.jobId);
  };

  return {
    node,
    mode,
    way,
    setWay,
    command,
    jobId,
    commandForm,
    sshForm,
    openFor,
    close,
    createCommand,
    submitSsh,
  };
};

export type ProvisionNodeAgentVM = ReturnType<typeof useProvisionNodeAgentVM>;
