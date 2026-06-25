import { type Row, type Table as TanstackTable } from "@tanstack/react-table";

export type { TanstackTable };

export interface TableInstanceResult<TData = unknown> {
  table: TanstackTable<TData>;
  rows: Row<TData>[];
  totalColumns: number;
  hasFooter: boolean;
}
