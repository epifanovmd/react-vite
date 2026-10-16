import { IMainApi } from "@shared/api";
import type { AgentCommandDto, AgentDto } from "@shared/api/gen/main/model";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useWorkerCommandVM } from "../useWorkerCommandVM";

vi.mock("@shared/lib/socket", async importOriginal => ({
  ...(await importOriginal<object>()),
  useSocketRoom: () => undefined,
  useSocketEvent: () => undefined,
}));

const agent = {
  id: "a-1",
  name: "node-01",
  workers: [
    {
      name: "echo",
      state: "running",
      version: "1.0.0",
      release: false,
      restarts: 0,
      health: { ok: true },
      manifest: {
        configs: [],
        commands: [{ type: "echo.quick" }],
        events: [],
        requests: [],
      },
    },
  ],
} as unknown as AgentDto;

const queued: AgentCommandDto = {
  id: "c-1",
  agentId: "a-1",
  type: "echo.quick",
  status: "pending",
  createdAt: 1,
};

const api = {
  sendAgentWorkerCommand: vi.fn(async () => ({ data: queued })),
  getAgentCommand: vi.fn(),
  cancelAgentCommand: vi.fn(),
};
const toast = { error: vi.fn(), success: vi.fn() };

beforeEach(() => {
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(INotificationService.Tid);
  vi.clearAllMocks();
});

describe("useWorkerCommandVM", () => {
  it("отправка завершается сразу после постановки, итог — в фоне", async () => {
    let finish: (value: { data: AgentCommandDto }) => void = () => undefined;

    api.getAgentCommand.mockImplementation(
      () => new Promise(resolve => (finish = resolve)),
    );

    const { result, unmount } = renderHook(() => useWorkerCommandVM(agent));
    let settled = false;

    await act(async () => {
      void result.current
        .submit({
          worker: "echo",
          type: "echo.quick",
          argsMode: "json",
          fields: {},
          args: "",
          timeoutSec: null,
        })
        .then(() => (settled = true));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(settled).toBe(true);
    expect(result.current.history[0]?.status).toBe("pending");

    await act(async () => {
      finish({ data: { ...queued, status: "done", ok: true } });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.history[0]?.status).toBe("done");
    unmount();
  });
});
