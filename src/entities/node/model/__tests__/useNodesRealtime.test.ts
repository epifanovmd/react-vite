import { iocContainer } from "@shared/lib/di";
import { ISocketTransport } from "@shared/lib/socket";
import { createFakeSocket, type IFakeSocket } from "@shared/lib/socket/testing";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { makeNode } from "../../lib/__tests__/node-fixture";
import { INodesStore } from "../types";
import { useNodesRealtime } from "../useNodesRealtime";

const store = {
  load: vi.fn(),
  upsert: vi.fn(),
  remove: vi.fn(),
  applyLoad: vi.fn(),
};
let socket: IFakeSocket;

beforeEach(() => {
  socket = createFakeSocket();
  iocContainer.bind(INodesStore.Tid).toConstantValue(store);
  iocContainer.bind(ISocketTransport.Tid).toConstantValue(socket);
});

afterEach(() => {
  iocContainer.unbind(INodesStore.Tid);
  iocContainer.unbind(ISocketTransport.Tid);
  vi.clearAllMocks();
});

const rooms = () =>
  socket.emitted.filter(e => e.event === "room:subscribe").map(e => e.args[0]);

describe("useNodesRealtime", () => {
  it("право на все — комната nodes, события в стор, переподключение — перечитать", () => {
    renderHook(() => useNodesRealtime("all"));

    expect(rooms()).toEqual([{ type: "nodes", id: "all" }]);

    act(() => socket.fire("node:updated", makeNode()));
    expect(store.upsert).toHaveBeenCalledWith(makeNode());

    act(() => socket.fire("node:deleted", { id: "n-1" }));
    expect(store.remove).toHaveBeenCalledWith("n-1");

    act(() => socket.reconnect());
    expect(store.load).toHaveBeenCalled();
  });

  it("свои — без комнаты, но личные события слушаются", () => {
    renderHook(() => useNodesRealtime("own"));

    expect(rooms()).toEqual([]);
    act(() => socket.fire("node:updated", makeNode()));
    expect(store.upsert).toHaveBeenCalled();

    const load = { nodeId: "n-1", agentId: "a-1", point: { at: 1 } };

    act(() => socket.fire("node:load", load));
    expect(store.applyLoad).toHaveBeenCalledWith(load);
  });

  it("без права — ничего", () => {
    renderHook(() => useNodesRealtime(null));

    act(() => socket.fire("node:updated", makeNode()));
    expect(rooms()).toEqual([]);
    expect(store.upsert).not.toHaveBeenCalled();
  });
});
