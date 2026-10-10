import { IMainApi } from "@shared/api";
import type { IAgentReleaseDto } from "@shared/api/gen/main/model";
import { iocContainer } from "@shared/lib/di";
import { ISocketTransport } from "@shared/lib/socket";
import { createFakeSocket, type IFakeSocket } from "@shared/lib/socket/testing";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AgentsStore } from "../store";
import { IAgentsStore } from "../types";
import { useAgentReleaseWatch } from "../useAgentReleaseWatch";

const api = { getAgentRelease: vi.fn() };
let socket: IFakeSocket;
let store: AgentsStore;

const release = (
  ...found: { agentId: string; target: string }[]
): { data: IAgentReleaseDto } => ({
  data: {
    manifest: null,
    candidates: found.map(c => ({
      ...c,
      name: c.agentId,
      online: true,
      current: "1.2.1",
      os: "linux",
      arch: "amd64",
      source: "agent",
    })),
    workerCandidates: [],
  },
});

beforeEach(() => {
  socket = createFakeSocket();
  store = new AgentsStore(api as unknown as IMainApi);
  api.getAgentRelease.mockResolvedValue(release());
  iocContainer.bind(ISocketTransport.Tid).toConstantValue(socket);
  iocContainer.bind(IAgentsStore.Tid).toConstantValue(store);
});

afterEach(() => {
  iocContainer.unbind(ISocketTransport.Tid);
  iocContainer.unbind(IAgentsStore.Tid);
  vi.clearAllMocks();
});

const subscribed = () =>
  socket.emitted.filter(e => e.event === "room:subscribe").map(e => e.args[0]);

describe("useAgentReleaseWatch", () => {
  it("с правом: сборки загружаются, комната agents, agent:release перечитывает сборки", () => {
    const onRelease = vi.fn();

    renderHook(() => useAgentReleaseWatch(true, { onRelease }));

    expect(api.getAgentRelease).toHaveBeenCalledTimes(1);
    expect(subscribed()).toEqual([{ type: "agents", id: "all" }]);

    const event = { version: "1.3.0", previous: "1.2.1", from: "github:o/r" };

    act(() => socket.fire("agent:release", event));

    expect(api.getAgentRelease).toHaveBeenCalledTimes(2);
    expect(onRelease).toHaveBeenCalledWith(event);
  });

  it("версия, найденная агентом за сессию, — onAgentUpdate; известные при открытии — нет", async () => {
    const onAgentUpdate = vi.fn();

    api.getAgentRelease.mockResolvedValueOnce(
      release({ agentId: "a-1", target: "1.3.0" }),
    );
    renderHook(() => useAgentReleaseWatch(true, { onAgentUpdate }));
    await waitFor(() => expect(store.release?.candidates).toHaveLength(1));
    expect(onAgentUpdate).not.toHaveBeenCalled();

    api.getAgentRelease.mockResolvedValueOnce(
      release(
        { agentId: "a-1", target: "1.3.0" },
        { agentId: "a-2", target: "1.3.0" },
      ),
    );
    await act(() => store.loadRelease());

    expect(onAgentUpdate).toHaveBeenCalledTimes(1);
    expect(onAgentUpdate.mock.calls[0][0]).toMatchObject({ agentId: "a-2" });
  });

  it("без права: ни запроса, ни комнаты, ни событий", () => {
    const onRelease = vi.fn();

    renderHook(() => useAgentReleaseWatch(false, { onRelease }));
    act(() =>
      socket.fire("agent:release", { version: "1.3.0", from: "github:o/r" }),
    );

    expect(api.getAgentRelease).not.toHaveBeenCalled();
    expect(subscribed()).toEqual([]);
    expect(onRelease).not.toHaveBeenCalled();
  });
});
