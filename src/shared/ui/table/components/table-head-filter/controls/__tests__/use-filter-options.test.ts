import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { FilterColumn } from "../filter-control-props";
import { useFilterOptions } from "../use-filter-options";

const facets = new Map<string, number>([
  ["a", 3],
  ["b", 1],
]);

const column: FilterColumn = {
  getFilterValue: vi.fn(),
  setFilterValue: vi.fn(),
  getFacetedUniqueValues: () => facets,
};

const options = [
  { value: "a", label: "Альфа" },
  { value: "b", label: "Бета" },
];

describe("useFilterOptions", () => {
  it("faceted: строковая подпись сохраняется как textLabel", () => {
    const { result } = renderHook(() =>
      useFilterOptions({ column, options, faceted: true }),
    );

    expect(result.current.options.map(o => o.textLabel)).toEqual([
      "Альфа",
      "Бета",
    ]);
  });

  it("faceted: поиск идёт по подписи, а не по value", () => {
    const { result } = renderHook(() =>
      useFilterOptions({ column, options, faceted: true }),
    );

    act(() => {
      result.current.onSearch?.("бет");
    });

    expect(result.current.options.map(o => o.value)).toEqual(["b"]);
  });
});
