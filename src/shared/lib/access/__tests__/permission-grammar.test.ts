import { describe, expect, it } from "vitest";

import { hasPermission, ownPermission, scopeIn } from "../permission-grammar";

describe("hasPermission", () => {
  it("точное право, wildcard и полный доступ", () => {
    expect(hasPermission(["file:share:create"], "file:share:create")).toBe(
      true,
    );
    expect(hasPermission(["file:share:*"], "file:share:create")).toBe(true);
    expect(hasPermission(["file:*"], "file:share:create")).toBe(true);
    expect(hasPermission(["*"], "file:share:create")).toBe(true);
    expect(hasPermission(["file:view"], "file:share:create")).toBe(false);
  });

  it("право на все покрывает «только свои», но не наоборот", () => {
    expect(hasPermission(["file:update"], "file:update:own")).toBe(true);
    expect(hasPermission(["file:*"], "file:update:own")).toBe(true);
    expect(hasPermission(["file:update:own"], "file:update")).toBe(false);
    expect(hasPermission(["file:view"], "file:update:own")).toBe(false);
  });
});

describe("ownPermission", () => {
  it("добавляет область «свои»", () => {
    expect(ownPermission("file:update")).toBe("file:update:own");
  });
});

describe("scopeIn", () => {
  it("all, own или null", () => {
    expect(scopeIn(["x:update"], "x:update")).toBe("all");
    expect(scopeIn(["x:*"], "x:update")).toBe("all");
    expect(scopeIn([ownPermission("x:update")], "x:update")).toBe("own");
    expect(scopeIn(["x:view"], "x:update")).toBe(null);
  });
});
