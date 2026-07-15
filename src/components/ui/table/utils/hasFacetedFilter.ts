import type { ColumnDef } from "@tanstack/react-table";

export const hasFacetedFilter = <TData,>(columns: ColumnDef<TData>[]): boolean =>
  columns.some(col => {
    const filter = "meta" in col ? (col as { meta?: { filter?: { faceted?: boolean } } }).meta?.filter : undefined;

    return filter?.faceted === true;
  });
