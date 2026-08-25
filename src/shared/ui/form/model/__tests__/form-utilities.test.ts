import { describe, expect, it } from "vitest";

import { normalizeEmptyString } from "../normalize-empty-string";

describe("form utilities", () => {
  it("normalizes an empty HTML value without changing other values", () => {
    expect(normalizeEmptyString("")).toBeUndefined();
    expect(normalizeEmptyString("value")).toBe("value");
    expect(normalizeEmptyString(0)).toBe(0);
  });
});
