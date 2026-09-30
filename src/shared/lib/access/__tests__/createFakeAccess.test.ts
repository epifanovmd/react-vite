import { describe, expect, it } from "vitest";

import { createFakeAccess } from "../testing";

describe("createFakeAccess", () => {
  it("права, область и владельцы — по реальным правилам", () => {
    const access = createFakeAccess({ permissions: ["x:update:own"] });

    expect(access.can("x:update")).toBe(false);
    expect(access.can("x:update:own")).toBe(true);
    expect(access.scope("x:update")).toBe("own");
    expect(access.canOn("x:update", ["u1"])).toBe(true);
    expect(access.canOn("x:update", ["u2", null])).toBe(false);
  });

  it("без пользователя своё не определить; отпечаток следит за правами", () => {
    const permissions = ["x:update:own"];
    const access = createFakeAccess({ userId: null, permissions });
    const before = access.accessKey;

    expect(access.user).toBeNull();
    expect(access.canOn("x:update", [null])).toBe(false);

    permissions.push("y:view");
    expect(access.accessKey).not.toBe(before);
  });
});
