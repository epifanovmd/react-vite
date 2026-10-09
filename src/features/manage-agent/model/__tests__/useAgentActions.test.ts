import { IAgentsStore } from "@entities/agent";
import { IMainApi } from "@shared/api";
import type { AgentDto, IAgentWorkerDto } from "@shared/api/gen/main/model";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAgentActions } from "../useAgentActions";
import { useWorkerActions } from "../useWorkerActions";

const confirm = vi.fn();

vi.mock("@shared/ui", async importOriginal => ({
  ...(await importOriginal<object>()),
  useConfirm: () => confirm,
}));

const agent = { id: "a-1", name: "node-01", version: "1.0.0" } as AgentDto;
const worker = (patch: Partial<IAgentWorkerDto> = {}): IAgentWorkerDto => ({
  name: "echo",
  state: "running",
  version: "1.0.0",
  health: { ok: true },
  ...patch,
});

const api = {
  revokeAgent: vi.fn(),
  deleteAgent: vi.fn(),
  rotateAgentKey: vi.fn(),
  updateAgent: vi.fn(),
  restartAgentWorker: vi.fn(),
  updateAgentWorker: vi.fn(),
};
const toast = { error: vi.fn(), success: vi.fn(), info: vi.fn() };
const store = {
  upsert: vi.fn(),
  remove: vi.fn(),
  trackDeferred: vi.fn(),
  deferredOf: vi.fn(),
};

beforeEach(() => {
  confirm.mockResolvedValue(true);
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);
  iocContainer.bind(IAgentsStore.Tid).toConstantValue(store);
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(INotificationService.Tid);
  iocContainer.unbind(IAgentsStore.Tid);
  vi.clearAllMocks();
});

describe("useAgentActions", () => {
  it("отзыв: подтверждение, запрос и новый агент в сторе", async () => {
    const revoked = { ...agent, revoked: true };

    api.revokeAgent.mockResolvedValue({ data: revoked });

    const { result } = renderHook(() => useAgentActions());

    await act(() => result.current.revoke(agent));

    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({ confirmVariant: "destructive" }),
    );
    expect(store.upsert).toHaveBeenCalledWith(revoked);
  });

  it("без подтверждения ничего не отправляется", async () => {
    confirm.mockResolvedValue(false);

    const { result } = renderHook(() => useAgentActions());

    await act(() => result.current.remove(agent));

    expect(api.deleteAgent).not.toHaveBeenCalled();
  });

  it("удаление убирает агента и сообщает наверх", async () => {
    const onDeleted = vi.fn();

    api.deleteAgent.mockResolvedValue({ data: undefined });

    const { result } = renderHook(() => useAgentActions({ onDeleted }));

    await act(() => result.current.remove(agent));

    expect(store.remove).toHaveBeenCalledWith("a-1");
    expect(onDeleted).toHaveBeenCalledWith(agent);
  });

  it("ошибка сервера показывается, агент остаётся", async () => {
    api.deleteAgent.mockResolvedValue({
      error: { message: "Удалить можно только отозванного агента" },
    });

    const onDeleted = vi.fn();
    const { result } = renderHook(() => useAgentActions({ onDeleted }));

    await act(() => result.current.remove(agent));

    expect(toast.error).toHaveBeenCalled();
    expect(onDeleted).not.toHaveBeenCalled();
  });

  it("смена ключа: ответ сервера — итог действия агента", async () => {
    api.rotateAgentKey.mockResolvedValue({ data: undefined });

    const { result } = renderHook(() => useAgentActions());

    await act(() => result.current.rotateKey(agent));

    expect(toast.success).toHaveBeenCalledWith("Ключ агента «node-01» сменён");
  });

  it("обновление: версия в вопросе, запрос без срока, итог — версия", async () => {
    api.updateAgent.mockResolvedValue({
      data: { version: "1.2.0", previous: "1.0.0" },
    });

    const { result } = renderHook(() => useAgentActions());

    await act(() => result.current.update(agent, "1.2.0"));
    expect(confirm).toHaveBeenLastCalledWith(
      expect.objectContaining({
        title: "Обновить агента «node-01» до версии 1.2.0?",
      }),
    );
    expect(api.updateAgent).toHaveBeenCalledWith("a-1", { timeout: 0 });
    expect(toast.success).toHaveBeenCalledWith(
      "Агент «node-01» работает на версии 1.2.0",
    );

    await act(() => result.current.update(agent, null));
    expect(confirm).toHaveBeenLastCalledWith(
      expect.objectContaining({
        title: "Обновить агента «node-01» до новой версии?",
      }),
    );
  });
});

describe("useWorkerActions", () => {
  it("перезапуск свободного — после подтверждения, итог сразу", async () => {
    api.restartAgentWorker.mockResolvedValue({ data: { deferred: false } });
    confirm.mockResolvedValueOnce(false);

    const { result } = renderHook(() => useWorkerActions());

    await act(() => result.current.restart(agent, worker()));
    expect(api.restartAgentWorker).not.toHaveBeenCalled();

    await act(() => result.current.restart(agent, worker()));
    expect(api.restartAgentWorker).toHaveBeenCalledWith("a-1", "echo", {
      force: false,
    });
    expect(toast.success).toHaveBeenCalledWith("Воркер «echo» перезапущен");
    expect(store.trackDeferred).not.toHaveBeenCalled();
  });

  it("занятый воркер: ответ сразу — замена ждёт, итог придёт событием", async () => {
    api.restartAgentWorker.mockResolvedValue({
      data: { deferred: true, pending: "restart", actionId: "act-1" },
    });

    const busy = worker({ health: { ok: true, busy: true } });
    const { result } = renderHook(() => useWorkerActions());

    await act(() => result.current.restart(agent, busy));
    expect(store.trackDeferred).toHaveBeenCalledWith({
      actionId: "act-1",
      agentId: "a-1",
      worker: "echo",
      pending: "restart",
    });
    expect(toast.info).toHaveBeenCalledWith(
      "Воркер «echo» занят — агент заменит его, когда освободится",
    );
    expect(toast.success).not.toHaveBeenCalled();
    expect(result.current.isBusy("restart", "echo")).toBe(false);
  });

  it("обновление: версия в тосте; отложенное — без тоста итога", async () => {
    api.updateAgentWorker
      .mockResolvedValueOnce({
        data: { deferred: false, version: "1.1.0", previous: "1.0.0" },
      })
      .mockResolvedValueOnce({
        data: { deferred: true, pending: "update", actionId: "act-2" },
      });

    const { result } = renderHook(() => useWorkerActions());

    await act(() => result.current.update(agent, worker(), "1.1.0"));
    expect(toast.success).toHaveBeenCalledWith(
      "Воркер «echo» работает на версии 1.1.0",
    );

    await act(() => result.current.update(agent, worker(), "1.1.0"));
    expect(store.trackDeferred).toHaveBeenCalledWith(
      expect.objectContaining({ actionId: "act-2", pending: "update" }),
    );
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it("заменить сейчас: ждущее обновление — обновление с force", async () => {
    api.updateAgentWorker.mockResolvedValue({
      data: { deferred: false, version: "1.1.0" },
    });
    api.restartAgentWorker.mockResolvedValue({ data: { deferred: false } });

    const { result } = renderHook(() => useWorkerActions());

    await act(() =>
      result.current.replaceNow(agent, worker({ pending: "update" }), "1.1.0"),
    );
    expect(api.updateAgentWorker).toHaveBeenCalledWith("a-1", "echo", {
      force: true,
    });
    expect(confirm).toHaveBeenLastCalledWith(
      expect.objectContaining({ confirmVariant: "destructive" }),
    );

    await act(() =>
      result.current.replaceNow(agent, worker({ pending: "restart" }), null),
    );
    expect(api.restartAgentWorker).toHaveBeenCalledWith("a-1", "echo", {
      force: true,
    });
  });

  it("заменить сейчас: ожидание из ответа, статус ещё не пришёл", async () => {
    api.updateAgentWorker.mockResolvedValue({
      data: { deferred: false, version: "1.1.0" },
    });
    store.deferredOf.mockReturnValue({ pending: "update" });

    const { result } = renderHook(() => useWorkerActions());

    await act(() => result.current.replaceNow(agent, worker(), "1.1.0"));
    expect(store.deferredOf).toHaveBeenCalledWith("a-1", "echo");
    expect(api.updateAgentWorker).toHaveBeenCalledWith("a-1", "echo", {
      force: true,
    });
  });

  it("ошибка — уведомление, без итога", async () => {
    api.updateAgentWorker.mockResolvedValue({
      error: { message: "У воркера нет сборки на сервере" },
    });

    const { result } = renderHook(() => useWorkerActions());

    await act(() => result.current.update(agent, worker(), "1.1.0"));
    expect(toast.error).toHaveBeenCalledWith("У воркера нет сборки на сервере");
    expect(toast.success).not.toHaveBeenCalled();
  });
});
