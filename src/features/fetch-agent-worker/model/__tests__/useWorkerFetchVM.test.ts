import { IMainSession } from "@shared/api";
import type { AgentDto } from "@shared/api/gen/main/model";
import { iocContainer } from "@shared/lib/di";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  bodyModesOf,
  fetchBodyOf,
  useWorkerFetchVM,
} from "../useWorkerFetchVM";

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
        jobs: [{ type: "echo.quick" }],
        requests: [],
        routes: [
          { method: "post", path: "/work/{id}/cancel" },
          { method: "GET", path: "/stream" },
          {
            method: "POST",
            path: "/echo",
            request: {
              type: "object",
              required: ["text"],
              properties: {
                text: { type: "string" },
                repeat: { type: "integer", minimum: 1 },
              },
            },
            response: { type: "object" },
          },
        ],
      },
    },
    { name: "sysmetrics", builtin: true },
  ],
} as unknown as AgentDto;

const form = {
  worker: "echo",
  route: "GET /stream",
  method: "GET" as const,
  path: "/stream",
  params: {},
  query: "",
  bodyMode: "none" as const,
  fields: {},
  body: "",
  headers: "",
  timeoutSec: null,
};

const echoFields = [
  {
    name: "text",
    kind: "string" as const,
    required: true,
    description: null,
    options: [],
    minimum: null,
    maximum: null,
    maxLength: null,
  },
];

beforeEach(() => {
  iocContainer.bind(IMainSession.Tid).toConstantValue({ accessToken: "t" });
});

afterEach(() => {
  iocContainer.unbind(IMainSession.Tid);
  vi.clearAllMocks();
});

describe("bodyModesOf", () => {
  it("по схеме — форма и JSON; чтение — без тела; остальное — выбор", () => {
    expect(bodyModesOf(null)).toEqual(["none"]);
    expect(bodyModesOf({ key: "GET /a", method: "GET", path: "/a" })).toEqual([
      "none",
    ]);
    expect(bodyModesOf({ key: "POST /a", method: "POST", path: "/a" })).toEqual(
      ["none", "json", "text"],
    );
    expect(
      bodyModesOf({
        key: "POST /a",
        method: "POST",
        path: "/a",
        request: { type: "array" },
      }),
    ).toEqual(["json"]);
  });
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

  it("параметры после «?» и тело формой по схеме", () => {
    expect(
      fetchBodyOf(
        {
          ...form,
          method: "POST",
          path: "/echo",
          query: "?upper=1",
          bodyMode: "form",
          fields: { text: "привет" },
        },
        echoFields,
      ),
    ).toEqual({
      method: "POST",
      path: "/echo?upper=1",
      headers: { "content-type": "application/json" },
      body: '{"text":"привет"}',
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
  it("воркеры без встроенного; маршруты — из манифеста и задач; выбор задаёт метод, путь и тело", () => {
    const { result } = renderHook(() => useWorkerFetchVM(agent));

    expect(result.current.workers.map(w => w.name)).toEqual(["echo"]);
    expect(result.current.routes.map(r => r.key)).toEqual([
      "POST /work/{id}/cancel",
      "GET /stream",
      "POST /echo",
      "POST /jobs",
      "GET /jobs/{id}",
      "POST /jobs/{id}/cancel",
    ]);

    act(() => result.current.pickRoute(result.current.routes[0]));
    expect(result.current.form.getValues("method")).toBe("POST");
    expect(result.current.form.getValues("path")).toBe("/work/{id}/cancel");
    expect(result.current.form.getValues("bodyMode")).toBe("none");
    expect(result.current.params).toEqual(["id"]);
  });

  it("маршрут со схемой тела — форма по полям; форма ↔ JSON переносит введённое", () => {
    const { result } = renderHook(() => useWorkerFetchVM(agent));

    act(() => result.current.pickRoute(result.current.routes[2]));
    expect(result.current.route?.key).toBe("POST /echo");
    expect(result.current.bodyModes).toEqual(["form", "json"]);
    expect(result.current.fields?.map(f => f.name)).toEqual(["text", "repeat"]);
    expect(result.current.form.getValues("bodyMode")).toBe("form");

    act(() => result.current.form.setValue("fields.text", "аб"));
    act(() => result.current.setBodyMode("json"));
    expect(JSON.parse(result.current.form.getValues("body"))).toEqual({
      text: "аб",
    });

    act(() => result.current.form.setValue("body", '{"text":"в","repeat":2}'));
    act(() => result.current.setBodyMode("form"));
    expect(result.current.form.getValues("fields")).toEqual({
      text: "в",
      repeat: "2",
    });
  });

  it("форма не по схеме — ошибки у полей, запрос не уходит", async () => {
    const { result } = renderHook(() => useWorkerFetchVM(agent));

    act(() => result.current.pickRoute(result.current.routes[2]));
    await act(() =>
      result.current.submit({
        ...result.current.form.getValues(),
        fields: { text: "", repeat: "0" },
      }),
    );

    expect(stream).not.toHaveBeenCalled();
    expect(
      result.current.form.getFieldState("fields.text").error?.message,
    ).toBe("Обязательное поле.");
    expect(
      result.current.form.getFieldState("fields.repeat").error?.message,
    ).toBe("Не меньше 1.");
  });

  it("смена воркера сбрасывает маршрут", () => {
    const { result } = renderHook(() => useWorkerFetchVM(agent));

    act(() => result.current.pickRoute(result.current.routes[1]));
    expect(result.current.route).not.toBeNull();
    act(() => result.current.form.setValue("worker", "other"));
    expect(result.current.form.getValues("route")).toBe("");
    expect(result.current.routes).toEqual([]);
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
