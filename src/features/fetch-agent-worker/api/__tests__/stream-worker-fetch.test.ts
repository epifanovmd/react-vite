import { afterEach, describe, expect, it, vi } from "vitest";

import { streamWorkerFetch } from "../stream-worker-fetch";

const tokens = (token = "t1") => {
  const source = {
    accessToken: token,
    ensureFreshToken: vi.fn(async () => undefined),
    refreshToken: vi.fn(async () => {
      source.accessToken = "t2";
    }),
  };

  return source;
};

const streamOf = (...chunks: string[]) =>
  new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    },
  });

const params = (source = tokens()) => ({
  baseUrl: "http://example.com",
  tokens: source,
  agentId: "a-1",
  worker: "echo",
  body: { method: "GET", path: "/stream" },
  signal: new AbortController().signal,
  onHead: vi.fn(),
  onChunk: vi.fn(),
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("streamWorkerFetch", () => {
  it("статус, заголовки и куски тела по мере прихода", async () => {
    const fetch = vi.fn(
      async () =>
        new Response(streamOf("a", "b"), {
          status: 201,
          headers: {
            "content-type": "text/plain",
            "x-agent-worker-status": "201",
          },
        }),
    );

    vi.stubGlobal("fetch", fetch);

    const p = params();
    const res = await streamWorkerFetch(p);

    expect(res).toEqual({ data: true });
    expect(fetch).toHaveBeenCalledWith(
      "http://example.com/api/v1/agents/a-1/workers/echo/fetch",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ method: "GET", path: "/stream" }),
        headers: expect.objectContaining({ Authorization: "Bearer t1" }),
      }),
    );
    expect(p.onHead).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 201,
        headers: expect.objectContaining({ "content-type": "text/plain" }),
        workerStatus: 201,
      }),
    );
    expect(p.onChunk).toHaveBeenCalledTimes(2);
  });

  it("без X-Agent-Worker-Status — ответ API, статуса воркера нет", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response('{"code":"TIMEOUT","message":"Срок истёк"}', {
            status: 504,
            headers: { "content-type": "application/json" },
          }),
      ),
    );

    const p = params();

    await streamWorkerFetch(p);
    expect(p.onHead).toHaveBeenCalledWith(
      expect.objectContaining({ status: 504, workerStatus: null }),
    );
  });

  it("401 — обновить токен и повторить один раз", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));

    vi.stubGlobal("fetch", fetch);

    const source = tokens();
    const res = await streamWorkerFetch(params(source));

    expect(res.data).toBe(true);
    expect(source.refreshToken).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[1][1].headers.Authorization).toBe("Bearer t2");
  });

  it("сбой сети — ошибка без исключения", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );

    expect(await streamWorkerFetch(params())).toEqual({
      error: { message: "Failed to fetch", isCanceled: false },
    });
  });
});
