import type { AuditEventDto } from "@shared/api/gen/main/model";
import { describe, expect, it, vi } from "vitest";

import { AUDIT_PAGE_SIZE, AuditFeed } from "../audit-feed";

const event = (id: string): AuditEventDto => ({
  id,
  type: "auth.login.succeeded",
  actorId: "u-1",
  subjectId: null,
  ip: null,
  userAgent: null,
  meta: {},
  createdAt: "2026-09-26T10:00:00.000Z",
});

describe("AuditFeed", () => {
  it("первая страница без курсора, следующая — по nextCursor", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce({
        data: { items: [event("e-1")], nextCursor: "c-1" },
        error: null,
      })
      .mockResolvedValueOnce({
        data: { items: [event("e-2")], nextCursor: null },
        error: null,
      });
    const feed = new AuditFeed(fetch);

    await feed.load();

    expect(fetch).toHaveBeenLastCalledWith(undefined, AUDIT_PAGE_SIZE);
    expect(feed.hasMore).toBe(true);

    await feed.loadMore();

    expect(fetch).toHaveBeenLastCalledWith("c-1", AUDIT_PAGE_SIZE);
    expect(feed.items.map(e => e.id)).toEqual(["e-1", "e-2"]);
    expect(feed.hasMore).toBe(false);
  });

  it("без курсора loadMore ничего не запрашивает", async () => {
    const fetch = vi.fn().mockResolvedValue({
      data: { items: [event("e-1")], nextCursor: null },
      error: null,
    });
    const feed = new AuditFeed(fetch);

    await feed.load();
    await feed.loadMore();

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("повторная загрузка начинает ленту заново", async () => {
    const fetch = vi.fn().mockResolvedValue({
      data: { items: [event("e-1")], nextCursor: "c-1" },
      error: null,
    });
    const feed = new AuditFeed(fetch);

    await feed.load();
    await feed.load();

    expect(fetch).toHaveBeenNthCalledWith(2, undefined, AUDIT_PAGE_SIZE);
    expect(feed.items).toHaveLength(1);
  });

  it("ошибка первой страницы видна в error", async () => {
    const feed = new AuditFeed(
      vi.fn().mockResolvedValue({ data: null, error: { message: "403" } }),
    );

    await feed.load();

    expect(feed.error?.message).toBe("403");
    expect(feed.items).toEqual([]);
  });

  it("новое событие — в начало ленты, повтор того же — без дубля", async () => {
    const feed = new AuditFeed(
      vi.fn().mockResolvedValue({
        data: { items: [event("e-1")], nextCursor: null },
        error: null,
      }),
    );

    await feed.load();
    feed.prepend(event("e-2"));
    feed.prepend(event("e-2"));

    expect(feed.items.map(e => e.id)).toEqual(["e-2", "e-1"]);
  });
});

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(r => {
    resolve = r;
  });

  return { promise, resolve };
};

const page = (ids: string[], nextCursor: string | null) => ({
  data: { items: ids.map(event), nextCursor },
  error: null,
});

describe("AuditFeed — устаревшие ответы", () => {
  it("смена фильтра A→B: ответ A, пришедший последним, не применяется", async () => {
    const a = deferred<unknown>();
    const b = deferred<unknown>();
    const fetch = vi
      .fn()
      .mockReturnValueOnce(a.promise)
      .mockReturnValueOnce(b.promise);
    const feed = new AuditFeed(fetch);

    const first = feed.load();
    const second = feed.load();

    b.resolve(page(["b"], null));
    await second;
    a.resolve(page(["a"], "c-a"));
    await first;

    expect(feed.items.map(e => e.id)).toEqual(["b"]);
    expect(feed.hasMore).toBe(false);
  });

  it("во время новой загрузки loadMore со старым курсором не уходит", async () => {
    const reload = deferred<unknown>();
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(page(["e-1"], "c-old"))
      .mockReturnValueOnce(reload.promise);
    const feed = new AuditFeed(fetch);

    await feed.load();
    const pending = feed.load();

    await feed.loadMore();

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).not.toHaveBeenCalledWith("c-old", AUDIT_PAGE_SIZE);

    reload.resolve(page(["e-2"], null));
    await pending;

    expect(feed.isLoading).toBe(false);
    expect(feed.items.map(e => e.id)).toEqual(["e-2"]);
  });

  it("подгрузка, начатая до новой загрузки, отбрасывается", async () => {
    const more = deferred<unknown>();
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(page(["e-1"], "c-1"))
      .mockReturnValueOnce(more.promise)
      .mockResolvedValueOnce(page(["x"], null));
    const feed = new AuditFeed(fetch);

    await feed.load();
    const older = feed.loadMore();

    await feed.load();
    more.resolve(page(["old"], "c-2"));
    await older;

    expect(feed.items.map(e => e.id)).toEqual(["x"]);
    expect(feed.hasMore).toBe(false);
    expect(feed.isLoadingMore).toBe(false);
  });
});
