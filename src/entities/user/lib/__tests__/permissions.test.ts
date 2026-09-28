import { describe, expect, it } from "vitest";

import { canAccess, computeEffectivePermissions } from "../permissions";

describe("canAccess", () => {
  it("точное право, wildcard домена и полный доступ", () => {
    expect(canAccess([], ["user:view"], "user:view")).toBe(true);
    expect(canAccess([], ["user:*"], "user:view")).toBe(true);
    expect(canAccess([], ["file:*"], "file:share:create")).toBe(true);
    expect(canAccess([], ["*"], "user:view")).toBe(true);
    expect(canAccess([], ["user:view"], "user:delete")).toBe(false);
    expect(canAccess([], ["role:*"], "user:view")).toBe(false);
  });

  it("роль admin — любой доступ", () => {
    expect(canAccess(["admin"], [], "user:delete")).toBe(true);
  });
});

describe("computeEffectivePermissions", () => {
  it("объединение без повторов", () => {
    expect(computeEffectivePermissions(["a:b", "c:d"], ["c:d", "e:f"])).toEqual(
      ["a:b", "c:d", "e:f"],
    );
  });
});
