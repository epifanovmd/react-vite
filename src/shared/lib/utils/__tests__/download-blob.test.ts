import { afterEach, describe, expect, it, vi } from "vitest";

import { downloadBlob } from "../download-blob";

afterEach(() => {
  vi.useRealTimers();
});

describe("downloadBlob", () => {
  it("отзывает object URL не сразу после клика, а с задержкой", () => {
    vi.useFakeTimers();
    const create = vi.fn(() => "blob:test");
    const revoke = vi.fn();

    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL: create,
      revokeObjectURL: revoke,
    });
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    downloadBlob(new Blob(["x"]), "file.txt");

    expect(click).toHaveBeenCalledOnce();
    expect(revoke).not.toHaveBeenCalled();
    expect(document.querySelector("a[download]")).toBeNull();

    vi.runAllTimers();
    expect(revoke).toHaveBeenCalledWith("blob:test");
    vi.unstubAllGlobals();
  });
});
