import { IAgentsStore } from "@entities/agent";
import { IJobStore } from "@entities/job";
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

import { useNodeDetailVM } from "../useNodeDetailVM";

const navigate = vi.fn();

vi.mock("@tanstack/react-router", async importOriginal => ({
  ...(await importOriginal<object>()),
  useNavigate: () => navigate,
}));
vi.mock("@shared/ui", async importOriginal => ({
  ...(await importOriginal<object>()),
  useConfirm: () => vi.fn(),
}));

const node = {
  id: "n-1",
  name: "alpha",
  host: "203.0.113.10",
  ownerId: "u-1",
  createdById: null,
  agentId: "a-1",
  agent: { address: "198.51.100.7", updateAvailable: true, online: true },
  job: { id: "j-1", kind: "install", status: "completed" },
} as unknown as NodeDto;

const agent = {
  id: "a-1",
  name: "alpha",
  online: true,
  revoked: false,
  workers: [],
} as unknown as AgentDto;

const nodes = {
  fetch: vi.fn(async () => ({ error: null })),
  byId: vi.fn(() => node),
  upsert: vi.fn(),
  remove: vi.fn(),
};
const agents = {
  fetch: vi.fn(async () => ({ error: null })),
  byId: vi.fn(() => agent),
  alertsOf: vi.fn(() => []),
  updateCandidate: vi.fn(() => null),
  loadAlerts: vi.fn(),
  loadRelease: vi.fn(),
  upsert: vi.fn(),
  remove: vi.fn(),
  applyAlert: vi.fn(),
};
const jobs = { fetch: vi.fn(async () => ({ id: "j-1" })), byId: vi.fn() };
const toast = { warning: vi.fn() };
let permissions: string[];
let socket: IFakeSocket;

beforeEach(() => {
  permissions = ["node:view:own", "node:agent:own"];
  socket = createFakeSocket();
  iocContainer.bind(INodesStore.Tid).toConstantValue(nodes);
  iocContainer.bind(IAgentsStore.Tid).toConstantValue(agents);
  iocContainer.bind(IJobStore.Tid).toConstantValue(jobs);
  iocContainer
    .bind(IUserStore.Tid)
    .toConstantValue(createFakeAccess({ userId: "u-1", permissions }));
  iocContainer.bind(IMainApi.Tid).toConstantValue({});
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);
  iocContainer.bind(ISocketTransport.Tid).toConstantValue(socket);
});

afterEach(() => {
  iocContainer.unbind(INodesStore.Tid);
  iocContainer.unbind(IAgentsStore.Tid);
  iocContainer.unbind(IJobStore.Tid);
  iocContainer.unbind(IUserStore.Tid);
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(INotificationService.Tid);
  iocContainer.unbind(ISocketTransport.Tid);
  vi.clearAllMocks();
});

const rooms = () =>
  socket.emitted.filter(e => e.event === "room:subscribe").map(e => e.args[0]);

describe("useNodeDetailVM", () => {
  it("узел, его агент и задача с сервера; комнаты узла и агента", async () => {
    renderHook(() => useNodeDetailVM("n-1"));

    expect(nodes.fetch).toHaveBeenCalledWith("n-1");
    expect(agents.fetch).toHaveBeenCalledWith("a-1");
    expect(jobs.fetch).toHaveBeenCalledWith("j-1");
    await waitFor(() =>
      expect(rooms()).toEqual([
        { type: "node", id: "n-1" },
        { type: "agent", id: "a-1" },
      ]),
    );
    expect(agents.loadAlerts).toHaveBeenCalled();
    // Сборки — только с правом на агентов.
    expect(agents.loadRelease).not.toHaveBeenCalled();
  });

  it("права узла: свой узел — действия с агентом, без журнала и правки", () => {
    const { result } = renderHook(() => useNodeDetailVM("n-1"));

    expect(result.current).toMatchObject({
      canUpdate: false,
      canDelete: false,
      canAssign: false,
      canProvision: false,
      canUpdateAgent: true,
      canRotate: true,
      updateTarget: null,
      addressMismatch: true,
      access: {
        canManage: true,
        canConfig: true,
        canFetch: true,
        canLogs: false,
      },
    });
  });

  it("чужой узел при области «свои» — действий нет", () => {
    nodes.byId.mockReturnValue({ ...node, ownerId: "u-9" });

    const { result } = renderHook(() => useNodeDetailVM("n-1"));

    expect(result.current.canUpdateAgent).toBe(false);
    expect(result.current.access.canManage).toBe(false);
    expect(result.current.access.canFetch).toBe(false);
    nodes.byId.mockReturnValue(node);
  });

  it("агент без связи — ни обновления, ни смены ключа", () => {
    agents.byId.mockReturnValue({ ...agent, online: false });

    const { result } = renderHook(() => useNodeDetailVM("n-1"));

    expect(result.current.canUpdateAgent).toBe(false);
    expect(result.current.canRotate).toBe(false);
    agents.byId.mockReturnValue(agent);
  });

  it("без права просмотра — ничего не грузит", () => {
    permissions.length = 0;
    renderHook(() => useNodeDetailVM("n-1"));

    expect(nodes.fetch).not.toHaveBeenCalled();
    expect(agents.fetch).not.toHaveBeenCalled();
    expect(rooms()).toEqual([]);
  });

  it("события: обновление узла и агента, удаление узла — уход к списку", () => {
    renderHook(() => useNodeDetailVM("n-1"));

    act(() => socket.fire("node:updated", { ...node, id: "n-2" }));
    expect(nodes.upsert).not.toHaveBeenCalled();
    act(() => socket.fire("node:updated", node));
    expect(nodes.upsert).toHaveBeenCalledWith(node);

    act(() => socket.fire("agent:updated", agent));
    expect(agents.upsert).toHaveBeenCalledWith(agent);
    act(() => socket.fire("agent:alert", { agentId: "a-1", active: true }));
    expect(agents.applyAlert).toHaveBeenCalled();

    act(() => socket.fire("node:deleted", { id: "n-1" }));
    expect(nodes.remove).toHaveBeenCalledWith("n-1");
    expect(navigate).toHaveBeenCalledWith({ to: "/nodes" });
  });
});
