import { type IAgentActionEvent, IAgentsStore } from "@entities/agent";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { ISocketTransport } from "@shared/lib/socket";
import { createFakeSocket, type IFakeSocket } from "@shared/lib/socket/testing";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useWorkerActionResults } from "../useWorkerActionResults";

const toast = { error: vi.fn(), success: vi.fn(), info: vi.fn() };
const store = { settleDeferred: vi.fn(), fetch: vi.fn() };
let socket: IFakeSocket;

const action = (patch: Partial<IAgentActionEvent>): IAgentActionEvent => ({
  id: "act-1",
  agentId: "a-1",
  name: "worker.restart",
  args: { name: "echo" },
  status: "done",
  createdAt: 1,
  finishedAt: 2,
  deferred: true,
  ...patch,
});

beforeEach(() => {
  socket = createFakeSocket();
  iocContainer.bind(ISocketTransport.Tid).toConstantValue(socket);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);
  iocContainer.bind(IAgentsStore.Tid).toConstantValue(store);
});

afterEach(() => {
  iocContainer.unbind(ISocketTransport.Tid);
  iocContainer.unbind(INotificationService.Tid);
  iocContainer.unbind(IAgentsStore.Tid);
  vi.clearAllMocks();
});

describe("useWorkerActionResults", () => {
  it("итог отложенной замены: тост, ожидание снято, агент перечитан", () => {
    renderHook(() => useWorkerActionResults("a-1"));

    act(() => socket.fire("agent:action", action({})));
    expect(store.settleDeferred).toHaveBeenCalledWith("act-1");
    expect(toast.success).toHaveBeenCalledWith("Воркер «echo» перезапущен");
    expect(store.fetch).toHaveBeenCalledWith("a-1");

    act(() =>
      socket.fire(
        "agent:action",
        action({ name: "worker.update", result: { version: "1.2.0" } }),
      ),
    );
    expect(toast.success).toHaveBeenLastCalledWith(
      "Воркер «echo» обновлён: версия 1.2.0",
    );
  });

  it("провал — тост ошибки; воркер — из ожидания, если его нет в событии", () => {
    store.settleDeferred.mockReturnValue({ worker: "kv" });
    renderHook(() => useWorkerActionResults("a-1"));

    act(() =>
      socket.fire(
        "agent:action",
        action({
          args: {},
          status: "failed",
          error: { code: "WORKER_START_FAILED", message: "Не запустился" },
        }),
      ),
    );
    expect(toast.error).toHaveBeenCalledWith("Не запустился", {
      title: "Воркер «kv» не перезапущен",
    });
  });

  it("чужой агент, не отложенное и не воркерное действие — пропускаются", () => {
    renderHook(() => useWorkerActionResults("a-1"));

    act(() => {
      socket.fire("agent:action", action({ agentId: "a-2" }));
      socket.fire("agent:action", action({ deferred: undefined }));
      socket.fire("agent:action", action({ name: "agent.update" }));
    });
    expect(store.settleDeferred).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
