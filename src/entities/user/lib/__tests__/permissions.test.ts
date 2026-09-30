import { describe, expect, it } from "vitest";

import {
  canAccess,
  computeEffectivePermissions,
  isOwnedBy,
  resolveScope,
} from "../permissions";

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

describe("canAccess: область «свои»", () => {
  it("право на все покрывает свои, но не наоборот", () => {
    expect(canAccess([], ["file:update"], "file:update:own")).toBe(true);
    expect(canAccess([], ["file:update:own"], "file:update")).toBe(false);
  });
});

describe("resolveScope", () => {
  it("admin — на все; иначе по набору прав", () => {
    expect(resolveScope(["admin"], [], "file:update")).toBe("all");
    expect(resolveScope([], ["file:update"], "file:update")).toBe("all");
    expect(resolveScope([], ["file:update:own"], "file:update")).toBe("own");
    expect(resolveScope([], [], "file:update")).toBe(null);
  });
});

describe("isOwnedBy", () => {
  it("пользователь среди владельцев", () => {
    expect(isOwnedBy("u1", [null, "u1"])).toBe(true);
    expect(isOwnedBy("u1", ["u2", null])).toBe(false);
    expect(isOwnedBy(undefined, [undefined])).toBe(false);
  });
});

describe("computeEffectivePermissions", () => {
  it("объединение без повторов", () => {
    expect(computeEffectivePermissions(["a:b", "c:d"], ["c:d", "e:f"])).toEqual(
      ["a:b", "c:d", "e:f"],
    );
  });
});
