import { agentModule, IAgentsStore } from "@entities/agent";
import { IMainApi } from "@shared/api";
import type {
  AgentDto,
  IAgentConfigEntryDto,
  IAgentEventDto,
} from "@shared/api/gen/main/model";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { ISocketTransport } from "@shared/lib/socket";
import { createFakeSocket, type IFakeSocket } from "@shared/lib/socket/testing";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAgentConfigsVM } from "../useAgentConfigsVM";
import { useAgentEventsVM } from "../useAgentEventsVM";
import { useAgentLogsVM } from "../useAgentLogsVM";
import { useAgentWorkersVM } from "../useAgentWorkersVM";

vi.mock("@shared/ui", async importOriginal => ({
  ...(await importOriginal<object>()),
  useConfirm: () => vi.fn(),
}));

const agent = {
  id: "a-1",
  name: "node-01",
  labels: {},
  online: true,
  revoked: false,
  enrolledAt: 1,
  alerts: [],
  metrics: { at: 1, workers: { echo: { done: 2 } } },
  workers: [
    {
      name: "echo",
      state: "running",
      release: true,
      health: { ok: true, busy: true },
      manifest: {
        version: "1.0.0",
        configs: [{ key: "settings", description: "Префикс" }],
        routes: [],
        events: [
          { type: "echo.done" },
          {
            type: "echo.started",
            description: "Воркер запущен",
            schema: { type: "object" },
          },
        ],
        jobs: [{ type: "echo.quick" }],
        requests: [],
      },
    },
    {
      name: "kv",
      state: "running",
      pending: "restart",
      manifest: {
        version: "2.0.0",
        configs: [],
        routes: [],
        events: [{ type: "kv.saved" }],
        jobs: [],
        requests: [],
      },
    },
    { name: "sysmetrics", state: "running", builtin: true },
  ],
} as unknown as AgentDto;

const event = (id: string, patch: Partial<IAgentEventDto> = {}) => ({
  id,
  agentId: "a-1",
  worker: "echo",
  type: "echo.done",
  at: Number(id),
  receivedAt: Number(id),
  ...patch,
});

const configEntry = (key: string, version: number): IAgentConfigEntryDto => ({
  worker: "echo",
  key,
  status: { agentId: "a-1", worker: "echo", key, version, state: "applying" },
});

const api = {
  getAgents: vi.fn(),
  getAgentAlerts: vi.fn(),
  getAgentRelease: vi.fn(),
  getAgentMetrics: vi.fn(async () => ({ data: [] })),
  getAgentEvents: vi.fn(),
  getAgentConfigs: vi.fn(),
  getAgentLogs: vi.fn(),
};
let socket: IFakeSocket;

beforeEach(() => {
  socket = createFakeSocket();
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.load(agentModule);
  iocContainer.bind(ISocketTransport.Tid).toConstantValue(socket);
  iocContainer
    .bind(INotificationService.Tid)
    .toConstantValue({ error: vi.fn(), info: vi.fn(), success: vi.fn() });
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unload(agentModule);
  iocContainer.unbind(ISocketTransport.Tid);
  iocContainer.unbind(INotificationService.Tid);
  vi.clearAllMocks();
});

describe("useAgentEventsVM", () => {
  it("лента агента с фильтрами на сервере; события из сокета — по фильтру", async () => {
    api.getAgentEvents.mockResolvedValue({
      data: { items: [event("2"), event("1")], nextCursor: null },
    });

    const { result } = renderHook(() => useAgentEventsVM(agent));

    await waitFor(() => expect(result.current.feed.items).toHaveLength(2));
    expect(api.getAgentEvents).toHaveBeenLastCalledWith({
      agentId: "a-1",
      worker: undefined,
      type: undefined,
      cursor: undefined,
      limit: 50,
    });
    expect(result.current.workerOptions).toEqual(["echo", "kv"]);
    expect(result.current.typeOptions).toEqual([
      "echo.done",
      "echo.started",
      "job.cancelled",
      "job.done",
      "job.failed",
      "job.progress",
      "kv.saved",
    ]);
    expect(result.current.declaration).toBeNull();

    act(() => result.current.setType("echo.started"));
    expect(result.current.declaration).toMatchObject({
      description: "Воркер запущен",
      schema: { type: "object" },
    });

    act(() => result.current.setWorker("kv"));
    await waitFor(() =>
      expect(api.getAgentEvents).toHaveBeenLastCalledWith(
        expect.objectContaining({ worker: "kv" }),
      ),
    );
    expect(result.current.typeOptions).toEqual(["kv.saved"]);

    act(() => socket.fire("agent:event", event("3", { worker: "echo" })));
    act(() => socket.fire("agent:event", event("4", { worker: "kv" })));
    act(() =>
      socket.fire("agent:event", event("5", { worker: "kv", agentId: "a-2" })),
    );
    expect(result.current.feed.items[0].id).toBe("4");
    expect(result.current.feed.items.some(item => item.id === "3")).toBe(false);
  });
});

describe("useAgentConfigsVM", () => {
  it("ключи из манифеста с заданными значениями; статус — из agent:config", async () => {
    api.getAgentConfigs.mockResolvedValue({
      data: [configEntry("settings", 3), configEntry("old", 1)],
    });

    const { result, rerender } = renderHook(() =>
      useAgentConfigsVM(agent, true),
    );

    await waitFor(() => {
      rerender();
      expect(result.current.groups[0].items).toHaveLength(2);
    });

    const [echo, kv] = result.current.groups;

    expect(echo.items.map(item => [item.key, !!item.manifest])).toEqual([
      ["settings", true],
      ["old", false],
    ]);
    expect(kv.items).toEqual([]);
    expect(result.current.groups.map(group => group.worker)).toEqual([
      "echo",
      "kv",
    ]);

    act(() =>
      socket.fire("agent:config", {
        ...configEntry("settings", 3).status,
        state: "applied",
        applied: 3,
      }),
    );
    rerender();
    expect(result.current.groups[0].items[0].entry?.status.state).toBe(
      "applied",
    );

    // Неизвестный ключ — список перечитывается.
    act(() => socket.fire("agent:config", configEntry("fresh", 1).status));
    expect(api.getAgentConfigs).toHaveBeenCalledTimes(2);
  });

  it("агент удалил ключ (deleted) — ключ пропадает без перечитывания", async () => {
    api.getAgentConfigs.mockResolvedValue({
      data: [configEntry("settings", 3), configEntry("old", 1)],
    });

    const { result, rerender } = renderHook(() =>
      useAgentConfigsVM(agent, true),
    );

    await waitFor(() => {
      rerender();
      expect(result.current.groups[0].items).toHaveLength(2);
    });

    act(() =>
      socket.fire("agent:config", {
        ...configEntry("old", 1).status,
        version: null,
        state: "deleted",
      }),
    );
    rerender();
    expect(result.current.groups[0].items.map(item => item.key)).toEqual([
      "settings",
    ]);

    // Ключ из манифеста остаётся строкой без значения.
    act(() =>
      socket.fire("agent:config", {
        ...configEntry("settings", 3).status,
        version: null,
        state: "deleted",
      }),
    );
    rerender();
    expect(result.current.groups[0].items[0].entry).toBeNull();
    expect(api.getAgentConfigs).toHaveBeenCalledTimes(1);
  });
});

describe("useAgentWorkersVM", () => {
  it("действия по строке: встроенный — без действий, занятый — заменить сейчас", () => {
    const { result } = renderHook(() => useAgentWorkersVM(agent, true));
    const [echo, kv, builtin] = result.current.rows;

    expect(echo.metrics).toEqual({ done: 2 });
    expect(result.current.accessOf(echo.worker)).toEqual({
      canRestart: true,
      updateTo: null,
      canReplaceNow: true,
    });
    expect(result.current.accessOf(kv.worker).canReplaceNow).toBe(true);
    expect(result.current.accessOf(builtin.worker)).toEqual({
      canRestart: false,
      updateTo: null,
      canReplaceNow: false,
    });
  });

  it("без права или без связи — без действий; кандидат выпуска — обновление", async () => {
    const store = iocContainer.get<IAgentsStore>(IAgentsStore.Tid);

    api.getAgentRelease.mockResolvedValue({
      data: {
        manifest: null,
        candidates: [],
        workerCandidates: [
          {
            agentId: "a-1",
            agentName: "node-01",
            online: true,
            worker: "echo",
            current: "1.0.0",
            target: "1.1.0",
            os: "linux",
            arch: "amd64",
          },
        ],
      },
    });
    await store.loadRelease();

    const { result: withRight } = renderHook(() =>
      useAgentWorkersVM(agent, true),
    );

    expect(withRight.current.accessOf(agent.workers[0]).updateTo).toBe("1.1.0");

    const { result: noRight } = renderHook(() =>
      useAgentWorkersVM(agent, false),
    );

    expect(noRight.current.accessOf(agent.workers[0]).canRestart).toBe(false);

    const { result: offline } = renderHook(() =>
      useAgentWorkersVM({ ...agent, online: false }, true),
    );

    expect(offline.current.accessOf(agent.workers[0]).updateTo).toBeNull();
  });
});

describe("useAgentLogsVM", () => {
  it("журнал с узла: агент или воркер, записи строками", async () => {
    api.getAgentLogs.mockResolvedValue({
      data: {
        entries: [{ at: 0, level: "warn", source: "echo", msg: "медленно" }],
      },
    });

    const { result, rerender } = renderHook(() => useAgentLogsVM("a-1"));

    act(() => result.current.loadTail());
    await waitFor(() => {
      rerender();
      expect(result.current.tail).toMatch(/WARN {2}\[echo\] медленно/);
    });
    expect(api.getAgentLogs).toHaveBeenLastCalledWith("a-1", { lines: 300 });

    act(() => result.current.setSource("echo"));
    act(() => result.current.loadTail());
    await waitFor(() =>
      expect(api.getAgentLogs).toHaveBeenLastCalledWith("a-1", {
        lines: 300,
        worker: "echo",
      }),
    );
  });
});
