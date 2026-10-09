import { IAgentsStore } from "@entities/agent";
import { INodesStore } from "@entities/node";
import { IUserStore } from "@entities/user";
import { IMainApi } from "@shared/api";
import type { NodeDto } from "@shared/api/gen/main/model";
import { createFakeAccess } from "@shared/lib/access/testing";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { ISocketTransport } from "@shared/lib/socket";
import { createFakeSocket, type IFakeSocket } from "@shared/lib/socket/testing";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useNodesVM } from "../useNodesVM";

vi.mock("@shared/ui", async importOriginal => ({
  ...(await importOriginal<object>()),
  useConfirm: () => vi.fn(),
}));

const node = (patch: Partial<NodeDto> = {}) =>
  ({
    id: "n-1",
    name: "alpha",
    host: "203.0.113.10",
    description: null,
    ownerId: "u-1",
    createdById: null,
    agentId: "a-1",
    ...patch,
  }) as NodeDto;

const nodes = [
  node(),
  node({ id: "n-2", name: "beta", ownerId: "u-2", agentId: null }),
];
let nodeList: NodeDto[] = nodes;
const loads = new Map<string, unknown>();
const store = {
  get nodes() {
    return nodeList;
  },
  isLoading: false,
  isLoaded: true,
  error: null,
  load: vi.fn(),
  upsert: vi.fn(),
  remove: vi.fn(),
  applyLoad: vi.fn(),
  loadOf: vi.fn((id: string) => loads.get(id)),
};
const agents = {
  load: vi.fn(),
  byId: vi.fn((id: string) => ({
    id,
    name: "agent",
    metrics: { at: 100, host: { cpuPercent: 10 } },
  })),
  upsert: vi.fn(),
  remove: vi.fn(),
  applyAlert: vi.fn(),
  loadAlerts: vi.fn(),
  loadRelease: vi.fn(),
};
const api = { getNodeMesh: vi.fn(async () => ({ data: null })) };
let permissions: string[];
let socket: IFakeSocket;

beforeEach(() => {
  permissions = ["node:view:own", "node:update:own", "node:create"];
  socket = createFakeSocket();
  iocContainer.bind(INodesStore.Tid).toConstantValue(store);
  iocContainer.bind(IAgentsStore.Tid).toConstantValue(agents);
  iocContainer
    .bind(IUserStore.Tid)
    .toConstantValue(createFakeAccess({ userId: "u-1", permissions }));
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(INotificationService.Tid).toConstantValue({});
  iocContainer.bind(ISocketTransport.Tid).toConstantValue(socket);
});

afterEach(() => {
  iocContainer.unbind(INodesStore.Tid);
  iocContainer.unbind(IAgentsStore.Tid);
  iocContainer.unbind(IUserStore.Tid);
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(INotificationService.Tid);
  iocContainer.unbind(ISocketTransport.Tid);
  vi.clearAllMocks();
  nodeList = nodes;
  loads.clear();
});

const rooms = () =>
  socket.emitted.filter(e => e.event === "room:subscribe").map(e => e.args[0]);

describe("useNodesVM", () => {
  it("свои: грузит узлы, агентов и связность; комнат nodes и agents нет", () => {
    renderHook(() => useNodesVM());

    expect(store.load).toHaveBeenCalled();
    expect(agents.load).toHaveBeenCalled();
    expect(api.getNodeMesh).toHaveBeenCalled();
    expect(rooms()).toEqual([]);
  });

  it("право на все узлы и агентов — обе комнаты", () => {
    permissions.push("node:view", "agent:view");
    renderHook(() => useNodesVM());

    expect(rooms()).toEqual([
      { type: "nodes", id: "all" },
      { type: "agents", id: "all" },
    ]);
  });

  it("без права просмотра ничего не грузит", () => {
    permissions.length = 0;
    renderHook(() => useNodesVM());

    expect(store.load).not.toHaveBeenCalled();
    expect(api.getNodeMesh).not.toHaveBeenCalled();
  });

  it("действия по строке — по области и владельцам", () => {
    const { result } = renderHook(() => useNodesVM());

    expect(result.current.accessOf(nodes[0])).toEqual({
      canUpdate: true,
      canDelete: false,
      canAssign: false,
      canProvision: false,
    });
    expect(result.current.accessOf(nodes[1]).canUpdate).toBe(false);
    expect(result.current.canCreate).toBe(true);
  });

  it("поиск и «Мои» фильтруют список; нагрузка — из списка агентов", () => {
    const { result } = renderHook(() => useNodesVM());

    act(() => result.current.setQuery("bet"));
    expect(result.current.nodes.map(n => n.id)).toEqual(["n-2"]);

    act(() => result.current.setQuery(""));
    act(() => result.current.setMine(true));
    expect(result.current.nodes.map(n => n.id)).toEqual(["n-1"]);
    expect(result.current.total).toBe(2);

    expect(result.current.loadOf(nodes[0])?.at).toBe(100);
    expect(result.current.loadOf(nodes[1])).toBeNull();
  });

  it("нагрузка: свежее событие node:load сильнее метрик из списка агентов", () => {
    const { result } = renderHook(() => useNodesVM());

    loads.set("n-1", { nodeId: "n-1", agentId: "a-1", point: { at: 200 } });
    expect(result.current.loadOf(nodes[0])?.at).toBe(200);

    loads.set("n-1", { nodeId: "n-1", agentId: "a-1", point: { at: 50 } });
    expect(result.current.loadOf(nodes[0])?.at, "старое событие").toBe(100);

    loads.set("n-1", { nodeId: "n-1", agentId: "a-old", point: { at: 300 } });
    expect(result.current.loadOf(nodes[0])?.at, "прежний агент").toBe(100);
  });

  it("свои: node:mesh лично заменяет связность; опроса нет", () => {
    vi.useFakeTimers();

    try {
      const { result, rerender } = renderHook(() => useNodesVM());
      const mesh = { nodes: [], cells: [], generatedAt: 3 };

      expect(api.getNodeMesh).toHaveBeenCalledTimes(1);
      act(() => socket.fire("node:mesh", mesh));
      rerender();
      expect(result.current.mesh).toEqual(mesh);

      act(() => vi.advanceTimersByTime(120_000));
      expect(api.getNodeMesh).toHaveBeenCalledTimes(1);
      expect(agents.load).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("состав узлов изменился — связность перечитывается", () => {
    const { rerender } = renderHook(() => useNodesVM());

    expect(api.getNodeMesh).toHaveBeenCalledTimes(1);
    rerender();
    expect(api.getNodeMesh).toHaveBeenCalledTimes(1);

    nodeList = [...nodes, node({ id: "n-3", name: "gamma" })];
    rerender();
    expect(api.getNodeMesh).toHaveBeenCalledTimes(2);
  });

  it("node:mesh в комнате nodes заменяет связность", () => {
    permissions.push("node:view");

    const { result, rerender } = renderHook(() => useNodesVM());
    const mesh = { nodes: [], cells: [], windowSec: 300, generatedAt: 2 };

    act(() => socket.fire("node:mesh", mesh));
    rerender();
    expect(result.current.mesh).toEqual(mesh);
  });
});
