import { IAgentsStore } from "@entities/agent";
import { IMainApi } from "@shared/api";
import type { AgentCommandDto } from "@shared/api/gen/main/model";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAgentCommand } from "../useAgentCommand";

const queued: AgentCommandDto = {
  id: "c-1",
  agentId: "a-1",
  type: "worker.restart",
  status: "pending",
  createdAt: 1,
};

const api = { getAgentCommand: vi.fn() };
const toast = { error: vi.fn(), success: vi.fn() };
const store = {
  fetch: vi.fn(),
  trackCommand: vi.fn(),
  settleCommand: vi.fn(),
};

beforeEach(() => {
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

describe("useAgentCommand", () => {
  it("уход с экрана прерывает опрос итога, итога нет", async () => {
    let signal: AbortSignal | undefined;

    api.getAgentCommand.mockImplementation(
      (_a, _c, _q, options: { signal?: AbortSignal }) => {
        signal = options.signal;

        return new Promise(resolve =>
          options.signal?.addEventListener("abort", () =>
            resolve({ error: { message: "canceled", isCanceled: true } }),
          ),
        );
      },
    );

    const { result, unmount } = renderHook(() => useAgentCommand());
    let done: AgentCommandDto | null | undefined;

    await act(async () => {
      void result.current
        .run("restart:echo", async () => ({ data: queued }))
        .then(res => (done = res));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(signal?.aborted).toBe(false);
    unmount();
    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    expect(signal?.aborted).toBe(true);
    expect(api.getAgentCommand).toHaveBeenCalledTimes(1);
    expect(done).toBeNull();
  });
});
