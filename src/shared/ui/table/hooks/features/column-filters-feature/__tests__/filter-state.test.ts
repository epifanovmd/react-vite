import type { ColumnDef } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";

import type { ColumnFilterConfig } from "../../../../table.types";
import { toColumnFiltersState, toFilterMap } from "../filter-state";
import { mergeFiltersIntoColumns } from "../merge-filters-into-columns";

interface Row {
  name: string;
  status: string;
}

const statusFilter = {
  type: "select",
  queryKey: "state",
  options: [],
} as unknown as ColumnFilterConfig;

const nested: ColumnDef<Row, any>[] = [
  {
    id: "group",
    header: "Группа",
    columns: [
      { accessorKey: "name" },
      {
        id: "inner",
        header: "Вложенная",
        columns: [{ accessorKey: "status" }],
      },
    ],
  },
];

type Leaf = ColumnDef<Row, any> & { columns?: ColumnDef<Row, any>[] };

describe("column filters во вложенных группах", () => {
  it("mergeFiltersIntoColumns проставляет фильтр листовой колонке в группе", () => {
    const merged = mergeFiltersIntoColumns(nested, { status: statusFilter });
    const group = merged[0] as Leaf;
    const inner = group.columns?.[1] as Leaf;
    const status = inner.columns?.[0];

    expect(status?.meta?.filter).toBe(statusFilter);
    expect((group.columns?.[0] as Leaf).meta?.filter).toBeUndefined();
  });

  it("toColumnFiltersState и toFilterMap учитывают queryKey вложенной колонки", () => {
    const columns = mergeFiltersIntoColumns(nested, { status: statusFilter });

    expect(toColumnFiltersState(columns, { state: "on", name: "a" })).toEqual([
      { id: "name", value: "a" },
      { id: "status", value: "on" },
    ]);
    expect(toFilterMap(columns, [{ id: "status", value: "on" }])).toEqual({
      state: "on",
    });
  });

  it("плоские колонки работают как прежде", () => {
    const flat: ColumnDef<Row, any>[] = [{ accessorKey: "name" }];

    expect(toColumnFiltersState(flat, undefined)).toEqual([]);
    expect(toFilterMap(flat, [{ id: "x", value: undefined }])).toEqual({});
  });
});
