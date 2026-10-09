import { IMainSession } from "@shared/api";
import type { AgentDto } from "@shared/api/gen/main/model";
import { iocContainer } from "@shared/lib/di";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchBodyOf, useWorkerFetchVM } from "../useWorkerFetchVM";

const stream = vi.fn();

vi.mock("../../api/stream-worker-fetch", () => ({
  streamWorkerFetch: (...args: unknown[]) => stream(...args),
}));

const agent = {
  id: "a-1",
  name: "node-01",
  online: true,
  revoked: false,
  workers: [
    {
      name: "echo",
      state: "running",
      manifest: {
        version: "1.0.0",
        configs: [],
        events: [],
        routes: [
          { method: "post", path: "/work/{id}/cancel" },
          { method: "GET", path: "/stream" },
        ],
      },
    },
    { name: "sysmetrics", builtin: true },
  ],
} as unknown as AgentDto;

const form = {
  worker: "echo",
  method: "GET" as const,
  path: "/stream",
  params: {},
  bodyMode: "none" as const,
  body: "",
  headers: "",
  timeoutSec: null,
};

beforeEach(() => {
  iocContainer.bind(IMainSession.Tid).toConstantValue({ accessToken: "t" });
});

afterEach(() => {
  iocContainer.unbind(IMainSession.Tid);
  vi.clearAllMocks();
});

describe("fetchBodyOf", () => {
  it("без тела — только метод и путь", () => {
    expect(fetchBodyOf(form)).toEqual({ method: "GET", path: "/stream" });
  });

  it("JSON: подстановки, тип тела, сжатый JSON, свои заголовки и срок", () => {
    expect(
      fetchBodyOf({
        ...form,
        method: "POST",
        path: " /work/{id}/cancel ",
        params: { id: "j 1" },
        bodyMode: "json",
        body: '{ "reason": "стоп" }',
        headers: "X-Trace: 7",
        timeoutSec: 5,
      }),
    ).toEqual({
      method: "POST",
      path: "/work/j%201/cancel",
      headers: { "x-trace": "7", "content-type": "application/json" },
      body: '{"reason":"стоп"}',
      timeoutMs: 5000,
    });
  });

  it("текст: свой content-type не перезаписывается", () => {
    expect(
      fetchBodyOf({
        ...form,
        method: "PUT",
        bodyMode: "text",
        body: "сырой текст",
        headers: "Content-Type: text/csv",
      }),
    ).toMatchObject({
      headers: { "content-type": "text/csv" },
      body: "сырой текст",
    });
  });
});

describe("useWorkerFetchVM", () => {
  it("воркеры без встроенного, маршрут подставляет метод, путь и тело", () => {
    const { result } = renderHook(() => useWorkerFetchVM(agent));

    expect(result.current.workers.map(w => w.name)).toEqual(["echo"]);
    expect(result.current.routes).toHaveLength(2);

    act(() => result.current.pickRoute(result.current.routes[0]));
    expect(result.current.form.getValues("method")).toBe("POST");
    expect(result.current.form.getValues("path")).toBe("/work/{id}/cancel");
    expect(result.current.form.getValues("bodyMode")).toBe("json");
  });

  it("отправка идёт потоком к выбранному воркеру агента", async () => {
    stream.mockImplementation(async params => {
      params.onHead({ status: 200, statusText: "OK", headers: {} });
      params.onChunk(new TextEncoder().encode("готово"));

      return { data: true };
    });

    const { result } = renderHook(() => useWorkerFetchVM(agent));

    await act(() => result.current.submit(form));

    expect(stream).toHaveBeenCalledWith(
      expect.objectContaining({
        agentId: "a-1",
        worker: "echo",
        body: { method: "GET", path: "/stream" },
      }),
    );
    expect(result.current.session.text).toBe("готово");
    expect(result.current.session.state).toBe("done");
  });
});
