import { describe, expect, it } from "vitest";

import { flattenObject } from "../flatten";

describe("flattenObject", () => {
  it("вложенные объекты — в camelCase-ключи, массивы и примитивы — как есть", () => {
    expect(
      flattenObject({
        Name: "a",
        address: { city: "M", geo: { lat: 1 } },
        tags: ["x"],
        empty: null,
      }),
    ).toEqual({
      name: "a",
      addressCity: "M",
      addressGeoLat: 1,
      tags: ["x"],
      empty: null,
    });
  });
});
