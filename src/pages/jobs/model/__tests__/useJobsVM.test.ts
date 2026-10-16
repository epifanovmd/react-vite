import { IAgentsStore } from "@entities/agent";
import { IJobStore } from "@entities/job";
import { IUserStore } from "@entities/user";
import { createFakeAccess } from "@shared/lib/access/testing";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { ISocketTransport } from "@shared/lib/socket";
import { createFakeSocket } from "@shared/lib/socket/testing";
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useJobsVM } from "../useJobsVM";

const jobs = {
  jobs: [],
  isLoading: false,
  error: null,
  load: vi.fn(async () => undefined),
};
const agents = { load: vi.fn(async () => undefined), byId: vi.fn() };

beforeEach(() => {
  iocContainer.bind(IJobStore.Tid).toConstantValue(jobs);
  iocContainer.bind(IAgentsStore.Tid).toConstantValue(agents);
  iocContainer
    .bind(IUserStore.Tid)
    .toConstantValue(createFakeAccess({ userId: "u", permissions: [] }));
  iocContainer.bind(ISocketTransport.Tid).toConstantValue(createFakeSocket());
  iocContainer
    .bind(INotificationService.Tid)
    .toConstantValue({ error: vi.fn(), success: vi.fn() });
});

afterEach(() => {
  iocContainer.unbind(IJobStore.Tid);
  iocContainer.unbind(IAgentsStore.Tid);
  iocContainer.unbind(IUserStore.Tid);
  iocContainer.unbind(ISocketTransport.Tid);
  iocContainer.unbind(INotificationService.Tid);
  vi.clearAllMocks();
});

describe("useJobsVM", () => {
  it("задачи грузятся один раз при открытии, не на каждый render", () => {
    const { rerender } = renderHook(() => useJobsVM());

    rerender();
    rerender();

    expect(jobs.load).toHaveBeenCalledTimes(1);
    expect(agents.load).not.toHaveBeenCalled();
  });

  it("ошибка загрузки списка доступна странице", () => {
    iocContainer.unbind(IJobStore.Tid);
    iocContainer
      .bind(IJobStore.Tid)
      .toConstantValue({ ...jobs, error: { message: "сбой" } });

    const { result } = renderHook(() => useJobsVM());

    expect(result.current.error).toEqual({ message: "сбой" });
  });
});
