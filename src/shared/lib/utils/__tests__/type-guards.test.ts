import { describe, expect, it } from "vitest";

import { isPromise } from "../type-guards";

describe("isPromise", () => {
  it("распознаёт промис и отвергает прочее", () => {
    expect(isPromise(Promise.resolve(1))).toBe(true);
    expect(isPromise({ then: () => undefined })).toBe(true);
    expect(isPromise(1)).toBe(false);
    expect(isPromise(null)).toBe(false);
  });
});
