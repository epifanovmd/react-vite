import { describe, expect, it } from "vitest";

import { nodeAddressMismatch } from "../address";
import { makeNode } from "./node-fixture";

const withAddress = (host: string | null, address: string | null) => {
  const node = makeNode({ host });

  return { host, agent: node.agent && { ...node.agent, address } };
};

describe("nodeAddressMismatch", () => {
  it("IP узла совпадает с адресом агента (с портом и без) — всё в порядке", () => {
    expect(
      nodeAddressMismatch(withAddress("203.0.113.10", "203.0.113.10")),
    ).toBe(false);
    expect(
      nodeAddressMismatch(withAddress("203.0.113.10", "203.0.113.10:51000")),
    ).toBe(false);
    expect(
      nodeAddressMismatch(withAddress("2001:db8::1", "[2001:DB8::1]:443")),
    ).toBe(false);
  });

  it("другой адрес — расхождение", () => {
    expect(
      nodeAddressMismatch(withAddress("203.0.113.10", "198.51.100.7")),
    ).toBe(true);
  });

  it("имя хоста, нет адреса или агента — не сравнивается", () => {
    expect(
      nodeAddressMismatch(withAddress("node.example.com", "198.51.100.7")),
    ).toBe(false);
    expect(nodeAddressMismatch(withAddress(null, "198.51.100.7"))).toBe(false);
    expect(nodeAddressMismatch(withAddress("203.0.113.10", null))).toBe(false);
    expect(nodeAddressMismatch({ host: "203.0.113.10", agent: null })).toBe(
      false,
    );
  });
});
