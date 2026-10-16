import { IAgentsStore } from "@entities/agent";
import { INodesStore } from "@entities/node";
import { IUserStore } from "@entities/user";
import { IMainApi } from "@shared/api";
import type { AgentDto, NodeDto } from "@shared/api/gen/main/model";
import { createFakeAccess } from "@shared/lib/access/testing";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { ISocketTransport } from "@shared/lib/socket";
import { createFakeSocket, type IFakeSocket } from "@shared/lib/socket/testing";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAgentDetailVM } from "../useAgentDetailVM";

const navigate = vi.fn();
const confirm = vi.fn();

vi.mock("@tanstack/react-router", async importOriginal => ({
  ...(await importOriginal<object>()),
  useNavigate: () => navigate,
}));
vi.mock("@shared/ui", async importOriginal => ({
  ...(await importOriginal<object>()),
  useConfirm: () => confirm,
}));

const agent = {
  id: "a-1",
  name: "node-01",
  online: true,
  revoked: false,
  workers: [],
} as unknown as AgentDto;

const store = {
  fetch: vi.fn(),
  byId: vi.fn(),
  alertsOf: vi.fn(),
  updateCandidate: vi.fn(),
  load: vi.fn(),
  loadRelease: vi.fn(),
  upsert: vi.fn(),
  remove: vi.fn(),
};
const nodes = {
  nodes: [{ id: "n-1", name: "alpha", agentId: "a-1" }] as NodeDto[],
  isLoaded: false,
  load: vi.fn(),
};
const toast = { warning: vi.fn(), success: vi.fn(), error: vi.fn() };
let socket: IFakeSocket;
const api = { deleteAgent: vi.fn() };
let permissions: string[];

beforeEach(() => {
  socket = createFakeSocket();
  store.fetch.mockResolvedValue({ error: null });
  store.byId.mockReturnValue(agent);
  store.alertsOf.mockReturnValue([]);
  store.updateCandidate.mockReturnValue(null);
  permissions = ["agent:view", "agent:manage"];
  iocContainer.bind(IAgentsStore.Tid).toConstantValue(store);
  iocContainer.bind(INodesStore.Tid).toConstantValue(nodes);
  iocContainer
    .bind(IUserStore.Tid)
    .toConstantValue(createFakeAccess({ permissions }));
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);
  iocContainer.bind(ISocketTransport.Tid).toConstantValue(socket);
});

afterEach(() => {
  iocContainer.unbind(IAgentsStore.Tid);
  iocContainer.unbind(INodesStore.Tid);
  iocContainer.unbind(IUserStore.Tid);
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(INotificationService.Tid);
  iocContainer.unbind(ISocketTransport.Tid);
  vi.clearAllMocks();
});

const rooms = () =>
  socket.emitted.filter(e => e.event === "room:subscribe").map(e => e.args[0]);

describe("useAgentDetailVM", () => {
  it("карточка с сервера, комнаты списка и агента, права на действия", () => {
    const { result } = renderHook(() => useAgentDetailVM("a-1"));

    expect(store.fetch).toHaveBeenCalledWith("a-1");
    expect(rooms()).toEqual([
      { type: "agents", id: "all" },
      { type: "agent", id: "a-1" },
    ]);
    expect(result.current).toMatchObject({
      canRotate: true,
      canRevoke: true,
      canDelete: true,
      updateTo: null,
      access: {
        canManage: true,
        canConfig: false,
        canCommand: false,
        canLogs: false,
      },
    });
  });

  it("агента удалили — уход к списку", () => {
    renderHook(() => useAgentDetailVM("a-1"));

    act(() => socket.fire("agent:deleted", { id: "a-2" }));
    expect(navigate).not.toHaveBeenCalled();

    act(() => socket.fire("agent:deleted", { id: "a-1" }));
    expect(toast.warning).toHaveBeenCalledWith("Агент удалён");
    expect(navigate).toHaveBeenCalledWith({ to: "/agents" });
  });

  it("узел агента — только с правом на узлы", () => {
    const { result, rerender } = renderHook(() => useAgentDetailVM("a-1"));

    expect(result.current.node).toBeNull();
    expect(nodes.load).not.toHaveBeenCalled();

    permissions.push("node:view:own");
    rerender();

    expect(nodes.load).toHaveBeenCalled();
    expect(result.current.node?.name).toBe("alpha");
  });
  it("своё удаление: событие «удалён» раньше ответа — без предупреждения и двойного перехода", async () => {
    let respond: (value: object) => void = () => undefined;

    confirm.mockResolvedValue(true);
    api.deleteAgent.mockReturnValue(
      new Promise(resolve => (respond = resolve)),
    );

    const { result } = renderHook(() => useAgentDetailVM("a-1"));
    let removing: Promise<unknown> = Promise.resolve();

    act(() => {
      removing = result.current.actions.remove(agent);
    });
    await waitFor(() => expect(api.deleteAgent).toHaveBeenCalled());
    act(() => socket.fire("agent:deleted", { id: "a-1" }));
    await act(async () => {
      respond({});
      await removing;
    });

    expect(toast.warning).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith({ to: "/agents" });
  });

  it("удаление не прошло, а событие «удалён» пришло — предупреждение и уход", async () => {
    let respond: (value: object) => void = () => undefined;

    confirm.mockResolvedValue(true);
    api.deleteAgent.mockReturnValue(
      new Promise(resolve => (respond = resolve)),
    );

    const { result } = renderHook(() => useAgentDetailVM("a-1"));
    let removing: Promise<unknown> = Promise.resolve();

    act(() => {
      removing = result.current.actions.remove(agent);
    });
    await waitFor(() => expect(api.deleteAgent).toHaveBeenCalled());
    act(() => socket.fire("agent:deleted", { id: "a-1" }));
    await act(async () => {
      respond({ error: { message: "Не найден" } });
      await removing;
    });

    expect(toast.warning).toHaveBeenCalledWith("Агент удалён");
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith({ to: "/agents" });
  });
});
