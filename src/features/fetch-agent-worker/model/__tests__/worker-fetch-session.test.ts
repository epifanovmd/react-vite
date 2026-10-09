import { describe, expect, it } from "vitest";

import type { TWorkerFetchRunner } from "../worker-fetch-session";
import { WorkerFetchSession } from "../worker-fetch-session";

const encode = (text: string) => new TextEncoder().encode(text);

/** Запрос, который отвечает по шагам: `step()` — следующий кусок. */
const controlled = () => {
  let resolve: (value: Awaited<ReturnType<TWorkerFetchRunner>>) => void = () =>
    undefined;
  let handlers: Parameters<TWorkerFetchRunner>[0] | null = null;
  const run: TWorkerFetchRunner = next => {
    handlers = next;

    return new Promise(done => {
      resolve = done;
    });
  };

  return {
    run,
    head: (contentType?: string, workerStatus: number | null = 200) =>
      handlers!.onHead({
        status: workerStatus ?? 502,
        statusText: workerStatus === null ? "Bad Gateway" : "OK",
        headers: contentType ? { "content-type": contentType } : {},
        workerStatus,
      }),
    chunk: (data: Uint8Array) => handlers!.onChunk(data),
    signal: () => handlers!.signal,
    finish: (res: Awaited<ReturnType<TWorkerFetchRunner>>) => resolve(res),
  };
};

describe("WorkerFetchSession", () => {
  it("текст приходит по кускам, итог — готово", async () => {
    const session = new WorkerFetchSession();
    const req = controlled();
    const done = session.start("GET /stream", req.run);

    expect(session.state).toBe("sending");
    req.head("text/plain");
    expect(session.state).toBe("streaming");

    // Буква разрезана между кусками — декодер её склеивает.
    const bytes = encode("при");

    req.chunk(bytes.slice(0, 3));
    req.chunk(bytes.slice(3));
    expect(session.text).toBe("при");
    expect(session.size).toBe(bytes.length);

    req.finish({ data: true });
    await done;
    expect(session.state).toBe("done");
    expect(session.request).toBe("GET /stream");
    expect(session.durationAt(0)).not.toBeNull();
  });

  it("двоичное тело — только размер и файл", async () => {
    const session = new WorkerFetchSession();
    const req = controlled();
    const done = session.start("GET /bytes", req.run);

    req.head("application/octet-stream");
    req.chunk(new Uint8Array([1, 2, 3]));
    req.finish({ data: true });
    await done;

    expect(session.text).toBeNull();
    expect(session.size).toBe(3);
    expect(session.blob().size).toBe(3);
    expect(session.blob().type).toBe("application/octet-stream");
  });

  it("отмена и ошибка; новый запрос гасит прежний", async () => {
    const session = new WorkerFetchSession();
    const first = controlled();
    const firstDone = session.start("GET /a", first.run);
    const second = controlled();
    const secondDone = session.start("GET /b", second.run);

    expect(first.signal().aborted).toBe(true);
    first.head();
    first.finish({ error: { message: "Запрос отменён", isCanceled: true } });
    await firstDone;
    // Ответ прежнего запроса не попадает в новый.
    expect(session.head).toBeNull();
    expect(session.state).toBe("sending");

    session.cancel();
    expect(second.signal().aborted).toBe(true);
    second.finish({ error: { message: "Запрос отменён", isCanceled: true } });
    await secondDone;
    expect(session.state).toBe("cancelled");

    const third = controlled();
    const thirdDone = session.start("GET /c", third.run);

    third.finish({ error: { message: "Ошибка сети", isCanceled: false } });
    await thirdDone;
    expect(session.state).toBe("failed");
    expect(session.error).toBe("Ошибка сети");
    expect(session.isRunning).toBe(false);
  });

  it("ответ воркера с ошибкой — его статус, не ошибка API", async () => {
    const session = new WorkerFetchSession();
    const req = controlled();
    const done = session.start("GET /missing", req.run);

    req.head("application/json", 404);
    req.chunk(encode('{"code":"NOT_FOUND","message":"нет"}'));
    req.finish({ data: true });
    await done;

    expect(session.isApiError).toBe(false);
    expect(session.apiError).toBeNull();
    expect(session.head?.workerStatus).toBe(404);
  });

  it("без статуса воркера — ошибка API: код и текст из тела", async () => {
    const session = new WorkerFetchSession();
    const req = controlled();
    const done = session.start("POST /echo", req.run);

    req.head("application/json", null);
    req.chunk(
      encode('{"code":"WORKER_UNAVAILABLE","message":"Воркер недоступен"}'),
    );
    // Пока тело приходит, ошибка ещё не разобрана.
    expect(session.apiError).toBeNull();
    req.finish({ data: true });
    await done;

    expect(session.isApiError).toBe(true);
    expect(session.apiError).toEqual({
      status: 502,
      code: "WORKER_UNAVAILABLE",
      message: "Воркер недоступен",
      reason: null,
    });
  });

  it("ошибка по манифесту — подробности агента из details.reason", async () => {
    const session = new WorkerFetchSession();
    const req = controlled();
    const done = session.start("POST /echo", req.run);

    req.head("application/json", null);
    req.chunk(
      encode(
        JSON.stringify({
          code: "AGENT_REQUEST_INVALID",
          message: "Тело не по схеме",
          details: { reason: "POST /echo: /text: нужна строка" },
        }),
      ),
    );
    req.finish({ data: true });
    await done;

    expect(session.apiError).toMatchObject({
      code: "AGENT_REQUEST_INVALID",
      reason: "POST /echo: /text: нужна строка",
    });
  });

  it("ошибка API не JSON — код неизвестен, текст — статус", async () => {
    const session = new WorkerFetchSession();
    const req = controlled();
    const done = session.start("POST /echo", req.run);

    req.head("text/plain", null);
    req.chunk(encode("gateway down"));
    req.finish({ data: true });
    await done;

    expect(session.apiError).toEqual({
      status: 502,
      code: null,
      message: "Bad Gateway",
      reason: null,
    });
  });
});
