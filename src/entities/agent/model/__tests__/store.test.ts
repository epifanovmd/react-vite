import type { IMainApi } from "@shared/api";
import type {
  AgentAlertDto,
  IAgentReleaseDto,
} from "@shared/api/gen/main/model";
import { describe, expect, it, vi } from "vitest";

import { makeAgent, makeWorker } from "../../lib/__tests__/agent-fixture";
import { AgentsStore } from "../store";

const release = (target = "1.2.0"): IAgentReleaseDto => ({
  manifest: { version: target, artifacts: [] },
  candidates: [
    {
      agentId: "a-1",
      name: "node-01",
      online: true,
      current: "1.1.0",
      target,
      os: "linux",
      arch: "amd64",
      source: "server",
    },
  ],
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
});

const alert = (patch: Partial<AgentAlertDto> = {}): AgentAlertDto => ({
  key: "workerDown:echo",
  type: "workerDown",
  agentId: "a-1",
  agentName: "node-01",
  active: true,
  message: "упал",
  since: 1,
  worker: "echo",
  ...patch,
});

const createStore = (api: Partial<IMainApi>) =>
  new AgentsStore(api as unknown as IMainApi);

describe("AgentsStore", () => {
  it("список: на связи — первыми", async () => {
    const store = createStore({
      getAgents: vi.fn().mockResolvedValue({
        data: {
          items: [
            makeAgent({ id: "b", name: "b", online: false }),
            makeAgent({ id: "a", name: "z" }),
          ],
          total: 2,
        },
      }),
    } as Partial<IMainApi>);

    await store.load();

    expect(store.agents.map(a => a.id)).toEqual(["a", "b"]);
  });

  it("агент по id попадает в список", async () => {
    const getAgent = vi.fn().mockResolvedValue({ data: makeAgent() });
    const store = createStore({ getAgent } as Partial<IMainApi>);

    expect((await store.fetch("a-1")).error).toBeNull();
    expect(store.byId("a-1")?.name).toBe("node-01");
  });

  it("проблемы: активная добавляется, закончившаяся убирается", () => {
    const store = createStore({});

    store.applyAlert(alert());
    store.applyAlert(
      alert({ key: "offline", type: "offline", worker: undefined, since: 2 }),
    );
    expect(store.alertsOf("a-1").map(a => a.type)).toEqual([
      "offline",
      "workerDown",
    ]);

    store.applyAlert(alert({ active: false }));
    expect(store.alerts.map(a => a.type)).toEqual(["offline"]);
  });

  it("удаление агента убирает и его проблемы", () => {
    const store = createStore({});

    store.upsert(makeAgent());
    store.applyAlert(alert());
    store.remove("a-1");

    expect(store.byId("a-1")).toBeUndefined();
    expect(store.alerts).toEqual([]);
  });

  it("проблема без поля active — активная", () => {
    const store = createStore({});

    store.applyAlert(alert({ active: undefined }));
    expect(store.alerts).toHaveLength(1);
  });

  it("кандидат на обновление пропадает, когда агент уже обновился", async () => {
    const getAgentRelease = vi.fn().mockResolvedValue({ data: release() });
    const store = createStore({ getAgentRelease } as Partial<IMainApi>);

    store.upsert(makeAgent());
    await store.loadRelease();
    expect(store.updateCandidate("a-1")?.target).toBe("1.2.0");
    expect(store.workerCandidate("a-1", "echo")?.target).toBe("1.1.0");

    store.upsert(makeAgent({ version: "1.2.0" }));

    expect(store.updateCandidate("a-1")).toBeNull();
    // Версия сменилась — сборки перечитываются.
    expect(getAgentRelease).toHaveBeenCalledTimes(2);

    store.upsert(
      makeAgent({
        version: "1.2.0",
        workers: [makeWorker({ version: "1.1.0" })],
      }),
    );
    expect(store.workerCandidate("a-1", "echo")).toBeNull();
  });

  it("сброс при выходе очищает всё", async () => {
    const store = createStore({
      getAgentRelease: vi.fn().mockResolvedValue({ data: release() }),
    } as Partial<IMainApi>);

    store.upsert(makeAgent());
    store.applyAlert(alert());
    await store.loadRelease();
    store.reset();

    expect(store.agents).toEqual([]);
    expect(store.alerts).toEqual([]);
    expect(store.release).toBeNull();
  });

  it("отложенная замена: ждёт итога; снимается итогом или статусом агента", () => {
    const store = new AgentsStore({} as IMainApi);
    const deferred = {
      actionId: "act-1",
      agentId: "a-1",
      worker: "echo",
      pending: "restart",
    };

    store.trackDeferred(deferred);
    expect(store.deferredOf("a-1", "echo")).toEqual(deferred);
    expect(store.deferredOf("a-1", "kv")).toBeUndefined();
    expect(store.settleDeferred("act-1")).toEqual(deferred);
    expect(store.settleDeferred("act-1")).toBeUndefined();
    expect(store.deferredOf("a-1", "echo")).toBeUndefined();

    // Итог потерялся: статус сначала показал замену, потом перестал.
    store.trackDeferred(deferred);
    store.upsert(makeAgent({ workers: [makeWorker()] }));
    expect(store.deferredOf("a-1", "echo")).toBeDefined();
    store.upsert(makeAgent({ workers: [makeWorker({ pending: "restart" })] }));
    store.upsert(makeAgent({ id: "a-2", workers: [makeWorker()] }));
    expect(store.deferredOf("a-1", "echo")).toBeDefined();
    store.upsert(makeAgent({ workers: [makeWorker()] }));
    expect(store.deferredOf("a-1", "echo")).toBeUndefined();

    store.trackDeferred(deferred);
    store.reset();
    expect(store.deferredOf("a-1", "echo")).toBeUndefined();
  });
});
