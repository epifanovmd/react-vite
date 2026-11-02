import { describe, expect, it } from "vitest";

import { getEnumNames, getEnumNamesAndValues } from "../enum-values";

enum Numeric {
  First,
  Second,
}

enum Text {
  Light = "light",
  Dark = "dark",
}

describe("getEnumNames / getEnumNamesAndValues", () => {
  it("числовой enum — только имена, без обратных ключей", () => {
    expect(getEnumNames(Numeric)).toEqual(["First", "Second"]);
    expect(getEnumNamesAndValues<number>(Numeric)).toEqual([
      { name: "First", value: 0 },
      { name: "Second", value: 1 },
    ]);
  });

  it("строковый enum — имена и значения", () => {
    expect(getEnumNamesAndValues<string>(Text)).toEqual([
      { name: "Light", value: "light" },
      { name: "Dark", value: "dark" },
    ]);
  });
});
