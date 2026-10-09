import type { IMainApi } from "@shared/api";
import { describe, expect, it, vi } from "vitest";

import { makeNode } from "../../lib/__tests__/node-fixture";
import { NodesStore } from "../store";

const createStore = (api: Record<string, unknown>) =>
  new NodesStore(api as unknown as IMainApi);

describe("NodesStore", () => {
  it("список по названию; повторная загрузка — тихое обновление", async () => {
    const getNodes = vi.fn(async () => ({
      data: {
        items: [makeNode({ id: "n-2", name: "beta" }), makeNode()],
        total: 2,
      },
    }));
    const store = createStore({ getNodes });

    expect(store.isLoaded).toBe(false);
    await store.load();

    expect(getNodes).toHaveBeenCalledWith({ limit: 100 });
    expect(store.nodes.map(n => n.name)).toEqual(["alpha", "beta"]);
    expect(store.isLoaded).toBe(true);

    await store.load();
    expect(getNodes).toHaveBeenCalledTimes(2);
  });

  it("карточка с сервера попадает в список; ошибка — возвращается", async () => {
    const getNodeById = vi
      .fn()
      .mockResolvedValueOnce({ data: makeNode({ id: "n-9", name: "zeta" }) })
      .mockResolvedValueOnce({ error: { message: "нет" } });
    const store = createStore({ getNodeById });

    expect(await store.fetch("n-9")).toEqual({ error: null });
    expect(store.byId("n-9")?.name).toBe("zeta");
    expect((await store.fetch("n-0")).error?.message).toBe("нет");
  });

  it("событие заменяет узел, удаление убирает, сброс очищает", async () => {
    const store = createStore({
      getNodes: async () => ({ data: { items: [makeNode()], total: 1 } }),
    });

    await store.load();
    store.upsert(makeNode({ name: "alpha-2" }));
    expect(store.byId("n-1")?.name).toBe("alpha-2");

    store.remove("n-1");
    expect(store.nodes).toEqual([]);

    store.upsert(makeNode());
    store.reset();
    expect(store.nodes).toEqual([]);
    expect(store.error).toBeNull();
  });

  it("нагрузка: последняя по времени точка; удаление узла и сброс её убирают", () => {
    const store = createStore({});
    const load = (at: number) => ({
      nodeId: "n-1",
      agentId: "a-1",
      point: { at, host: { cpuPercent: at } },
    });

    store.applyLoad(load(2));
    store.applyLoad(load(1));
    expect(store.loadOf("n-1")?.point.at).toBe(2);
    store.applyLoad(load(3));
    expect(store.loadOf("n-1")?.point.at).toBe(3);

    store.remove("n-1");
    expect(store.loadOf("n-1")).toBeUndefined();

    store.applyLoad(load(4));
    store.reset();
    expect(store.loadOf("n-1")).toBeUndefined();
  });
});
