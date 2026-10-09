import { IAgentsStore } from "@entities/agent";
import { IMainApi } from "@shared/api";
import type {
  INodeInstallCommandDto,
  NodeDto,
} from "@shared/api/gen/main/model";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { useZodForm } from "@shared/ui";
import { useEffect, useState } from "react";

import {
  installCommandSchema,
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
  const agents = IAgentsStore.useInstance();
  const [node, setNode] = useState<NodeDto | null>(null);
  const [mode, setMode] = useState<TProvisionMode>("install");
  const [way, setWay] = useState<TInstallWay>("command");
  const [command, setCommand] = useState<INodeInstallCommandDto | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const commandForm = useZodForm(installCommandSchema, {
    defaultValues: {
      expiresInMinutes: DEFAULT_EXPIRES_MINUTES,
      baseUrl: "",
      workers: [],
    },
  });
  const sshForm = useZodForm(sshSchema);

  /** Воркеры из выпуска сервера — их можно поставить вместе с агентом. */
  const releaseWorkers = [
    ...new Set(agents.release?.manifest?.workers?.map(w => w.name) ?? []),
  ].sort();
  const releaseKey = releaseWorkers.join(",");

  // Выпуск пришёл после открытия окна — отметить его воркеры, пока выбор не трогали.
  useEffect(() => {
    if (!node || !releaseKey) return;
    const names = releaseKey.split(",");

    if (!commandForm.getFieldState("workers").isDirty) {
      commandForm.setValue("workers", names);
    }
    if (!sshForm.getFieldState("workers").isDirty) {
      sshForm.setValue("workers", names);
    }
  }, [node, releaseKey, commandForm, sshForm]);

  const openFor = (target: NodeDto, nextMode: TProvisionMode = "install") => {
    if (nextMode === "install") void agents.loadRelease();
    setMode(nextMode);
    setWay(nextMode === "install" && target.host ? "ssh" : "command");
    setCommand(null);
    setJobId(null);
    // По умолчанию — все воркеры выпуска: снять лишние проще, чем вспомнить имена.
    commandForm.reset({
      expiresInMinutes: DEFAULT_EXPIRES_MINUTES,
      baseUrl: "",
      workers: releaseWorkers,
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
      workers: releaseWorkers,
      purge: false,
    });
    setNode(target);
  };

  const close = () => setNode(null);

  const createCommand = async (data: TInstallCommandValues) => {
    if (!node) return;

    const { workers } = data;
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

    const { workers } = data;
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
    releaseWorkers,
  };
};

export type ProvisionNodeAgentVM = ReturnType<typeof useProvisionNodeAgentVM>;
