import type { ColumnDef } from "@tanstack/react-table";

import type { ColumnFilterConfig } from "../../../table.types";
import { getColumnDefId } from "../column-id";

type GroupColumnDef<TData> = ColumnDef<TData, any> & {
  columns?: ColumnDef<TData, any>[];
};

/** Проставляет `meta.filter` колонкам по id, включая вложенные в группы. */
export const mergeFiltersIntoColumns = <TData>(
  columns: ColumnDef<TData, any>[],
  filters: Record<string, ColumnFilterConfig | undefined>,
): ColumnDef<TData, any>[] =>
  columns.map(column => {
    const id = getColumnDefId(column);
    const filter = id ? filters[id] : undefined;
    const children = (column as GroupColumnDef<TData>).columns;
    const withChildren = children
      ? { ...column, columns: mergeFiltersIntoColumns(children, filters) }
      : column;

    return filter
      ? { ...withChildren, meta: { ...column.meta, filter } }
      : withChildren;
  });
