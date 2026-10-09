import { IJobStore } from "@entities/job";
import { IMainApi } from "@shared/api";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  demoJobBody,
  type TDemoJobForm,
  useRunDemoJobVM,
} from "../useRunDemoJobVM";

const api = { demoEchoJob: vi.fn() };
const jobs = { fetch: vi.fn() };
const toast = { info: vi.fn(), error: vi.fn() };

const values = (patch: Partial<TDemoJobForm>): TDemoJobForm => ({
  kind: "long",
  text: "привет",
  steps: null,
  delayMs: null,
  fail: false,
  withOutput: false,
  lookup: false,
  ...patch,
});

beforeEach(() => {
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(IJobStore.Tid).toConstantValue(jobs);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(IJobStore.Tid);
  iocContainer.unbind(INotificationService.Tid);
  vi.clearAllMocks();
});

describe("demoJobBody", () => {
  it("быстрая задача — только текст, параметры долгой не уходят", () => {
    expect(
      demoJobBody(values({ kind: "quick", steps: 3, fail: true })),
    ).toEqual({ text: "привет" });
    expect(demoJobBody(values({ kind: "quick", lookup: true }))).toEqual({
      text: "привет",
      lookup: true,
    });
    expect(demoJobBody(values({ lookup: true }))).toEqual({
      text: "привет",
      long: true,
    });
  });

  it("долгая — long и заданные параметры; пустые и выключенные не уходят", () => {
    expect(
      demoJobBody(
        values({ steps: 5, delayMs: 0, fail: true, withOutput: true }),
      ),
    ).toEqual({
      text: "привет",
      long: true,
      steps: 5,
      delayMs: 0,
      fail: true,
      withOutput: true,
    });
    expect(demoJobBody(values({}))).toEqual({ text: "привет", long: true });
  });
});

describe("useRunDemoJobVM", () => {
  it("задача ставится, карточка подтягивается без ожидания сокета", async () => {
    api.demoEchoJob.mockResolvedValue({ data: { jobId: "j-1" } });

    const { result } = renderHook(() => useRunDemoJobVM());

    await act(() => result.current.submit(values({ kind: "quick" })));
    expect(api.demoEchoJob).toHaveBeenLastCalledWith({ text: "привет" });
    expect(jobs.fetch).toHaveBeenCalledWith("j-1");
    expect(toast.info).toHaveBeenCalled();
  });

  it("ошибка API — тост, задача не подтягивается", async () => {
    api.demoEchoJob.mockResolvedValue({
      error: { message: "Неверные данные", status: 400 },
    });

    const { result } = renderHook(() => useRunDemoJobVM());

    await act(() => result.current.submit(values({})));
    expect(jobs.fetch).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });
});
