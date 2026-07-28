import type { TableOptions, TableState } from "@tanstack/react-table";

export type TableFeatureKind =
  | "sorting"
  | "columnFilters"
  | "globalFilter"
  | "rowSelection"
  | "pagination"
  | "columnVisibility"
  | "columnOrder"
  | "columnPinning"
  | "columnSizing"
  | "expanding"
  | "grouping";

export interface TableFeatureResult<TData, TMeta = unknown> {
  kind: TableFeatureKind;
  state: Partial<TableState>;
  options: Partial<Omit<TableOptions<TData>, "data" | "columns" | "state">>;
  meta?: TMeta;
}
