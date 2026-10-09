import { IAgentsStore } from "@entities/agent";
import { IMainApi } from "@shared/api";
import type { NodeDto } from "@shared/api/gen/main/model";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useProvisionNodeAgentVM } from "../useProvisionNodeAgentVM";
import { sshBody, sshSchema, type TSshValues } from "../validation";

const node = { id: "n-1", name: "alpha", host: "203.0.113.10" } as NodeDto;

const api = {
  createNodeInstallCommand: vi.fn(),
  installNodeAgent: vi.fn(),
  uninstallNodeAgent: vi.fn(),
};
const toast = { success: vi.fn(), error: vi.fn() };
const agents = {
  release: {
    manifest: { workers: [{ name: "netprobe" }, { name: "echo" }] },
  },
  loadRelease: vi.fn().mockResolvedValue(undefined),
};

const ssh = (patch: Partial<TSshValues> = {}): TSshValues => ({
  host: "",
  port: 22,
  username: "root",
  auth: "password",
  password: "secret",
  privateKey: "",
  passphrase: "",
  sudo: true,
  backendUrl: "",
  workers: [],
  purge: false,
  ...patch,
});

beforeEach(() => {
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);
  iocContainer.bind(IAgentsStore.Tid).toConstantValue(agents);
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(INotificationService.Tid);
  iocContainer.unbind(IAgentsStore.Tid);
  vi.clearAllMocks();
});

describe("sshSchema", () => {
  it("нужен пароль или ключ — смотря что выбрано", () => {
    expect(sshSchema.safeParse(ssh({ password: "" })).success).toBe(false);
    expect(
      sshSchema.safeParse(ssh({ auth: "key", password: "", privateKey: "" }))
        .success,
    ).toBe(false);
    expect(
      sshSchema.safeParse(ssh({ auth: "key", privateKey: "-----BEGIN" }))
        .success,
    ).toBe(true);
  });
});

describe("sshBody", () => {
  it("пароль: без ключа; root — без sudo; пустое — не отправляется", () => {
    expect(sshBody(ssh())).toEqual({
      host: undefined,
      port: 22,
      username: "root",
      password: "secret",
      sudo: undefined,
      backendUrl: undefined,
    });
  });

  it("ключ: без пароля; не root — sudo как выбрано", () => {
    expect(
      sshBody(
        ssh({
          auth: "key",
          privateKey: "KEY",
          passphrase: "pp",
          username: "deploy",
          sudo: false,
          host: "198.51.100.7",
        }),
      ),
    ).toEqual({
      host: "198.51.100.7",
      port: 22,
      username: "deploy",
      privateKey: "KEY",
      passphrase: "pp",
      sudo: false,
      backendUrl: undefined,
    });
  });
});

describe("useProvisionNodeAgentVM", () => {
  it("установка: узел с адресом — сразу SSH; команда — с токеном", async () => {
    const command = {
      command: "curl … | sudo sh",
      token: "t",
      tokenId: "tid",
      expiresAt: "2026-10-09T10:00:00.000Z",
    };

    api.createNodeInstallCommand.mockResolvedValue({ data: command });

    const { result } = renderHook(() => useProvisionNodeAgentVM());

    act(() => result.current.openFor(node));
    expect(result.current.mode).toBe("install");
    expect(result.current.way).toBe("ssh");
    expect(result.current.sshForm.getValues("host")).toBe("203.0.113.10");
    // Все воркеры выпуска отмечены по умолчанию.
    expect(result.current.releaseWorkers).toEqual(["echo", "netprobe"]);
    expect(result.current.commandForm.getValues("workers")).toEqual([
      "echo",
      "netprobe",
    ]);
    expect(result.current.sshForm.getValues("workers")).toEqual([
      "echo",
      "netprobe",
    ]);

    await act(() =>
      result.current.createCommand({
        expiresInMinutes: 60,
        baseUrl: "",
        workers: ["netprobe", "example"],
      }),
    );
    expect(api.createNodeInstallCommand).toHaveBeenCalledWith("n-1", {
      expiresInMinutes: 60,
      baseUrl: undefined,
      workers: ["netprobe", "example"],
    });
    expect(result.current.command).toEqual(command);
  });

  it("узел без адреса — вкладка команды", () => {
    const { result } = renderHook(() => useProvisionNodeAgentVM());

    act(() => result.current.openFor({ ...node, host: null }));
    expect(result.current.way).toBe("command");
  });

  it("SSH-установка ставит задачу; удаление — с purge", async () => {
    const onStarted = vi.fn();

    api.installNodeAgent.mockResolvedValue({ data: { jobId: "j-1" } });
    api.uninstallNodeAgent.mockResolvedValue({ data: { jobId: "j-2" } });

    const { result } = renderHook(() => useProvisionNodeAgentVM({ onStarted }));

    act(() => result.current.openFor(node));
    await act(() => result.current.submitSsh(ssh()));
    expect(api.installNodeAgent).toHaveBeenCalledWith(
      "n-1",
      expect.objectContaining({ password: "secret", workers: undefined }),
    );
    expect(result.current.jobId).toBe("j-1");
    expect(onStarted).toHaveBeenCalledWith("j-1");

    act(() => result.current.openFor(node, "uninstall"));
    expect(result.current.jobId).toBeNull();
    await act(() => result.current.submitSsh(ssh({ purge: true })));
    expect(api.uninstallNodeAgent).toHaveBeenCalledWith(
      "n-1",
      expect.objectContaining({ purge: true }),
    );
  });

  it("ошибка сервера — задачи нет", async () => {
    api.installNodeAgent.mockResolvedValue({ error: { message: "занято" } });

    const { result } = renderHook(() => useProvisionNodeAgentVM());

    act(() => result.current.openFor(node));
    await act(() => result.current.submitSsh(ssh()));
    expect(result.current.jobId).toBeNull();
    expect(toast.error).toHaveBeenCalled();
  });
});
