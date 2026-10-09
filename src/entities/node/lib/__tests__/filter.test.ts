import { describe, expect, it } from "vitest";

import { filterNodes } from "../filter";
import { nodeOwners } from "../permissions";
import { makeNode } from "./node-fixture";

const nodes = [
  makeNode({ id: "n-1", name: "alpha", host: "203.0.113.10" }),
  makeNode({
    id: "n-2",
    name: "beta",
    host: "beta.example.com",
    ownerId: null,
    createdById: "u-3",
    description: "резерв",
  }),
];

describe("filterNodes", () => {
  it("поиск по названию, адресу и описанию без учёта регистра", () => {
    const ids = (query: string) =>
      filterNodes(nodes, { query, mine: false }, null).map(n => n.id);

    expect(ids("ALP")).toEqual(["n-1"]);
    expect(ids("example")).toEqual(["n-2"]);
    expect(ids("резерв")).toEqual(["n-2"]);
    expect(ids("  ")).toEqual(["n-1", "n-2"]);
  });

  it("«Мои» — владелец или создатель", () => {
    const mine = (userId: string | null) =>
      filterNodes(nodes, { query: "", mine: true }, userId).map(n => n.id);

    expect(mine("u-1")).toEqual(["n-1"]);
    expect(mine("u-3")).toEqual(["n-2"]);
    expect(mine(null)).toEqual([]);
  });
});

describe("nodeOwners", () => {
  it("владелец и создатель", () => {
    expect(nodeOwners({ ownerId: null, createdById: "u-2" })).toEqual([
      null,
      "u-2",
    ]);
  });
});
