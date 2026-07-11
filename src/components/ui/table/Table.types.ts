import type {
  ColumnDef,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
  Table as TanstackTable,
} from "@tanstack/react-table";
import type * as React from "react";

export interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];

  variant?: "default" | "striped" | "bordered";
  size?: "sm" | "md" | "lg";
  caption?: React.ReactNode;
  stickyHeader?: boolean;
  className?: string;
  containerClassName?: string;

  // Sorting
  sorting?: boolean;
  sortingState?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  manualSorting?: boolean;

  // Global filter
  globalFilter?: string;
  onGlobalFilterChange?: OnChangeFn<string>;

  // Row selection
  selection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onSelectedRowsChange?: (rows: TData[]) => void;

  // State
  loading?: boolean;
  refreshing?: boolean;
  empty?: React.ReactNode;

  // Row
  onRowClick?: (
    row: TData,
    event: React.MouseEvent<HTMLTableRowElement>,
  ) => void;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
}

export interface TableInstanceResult<TData = unknown> {
  table: TanstackTable<TData>;
  rows: Row<TData>[];
  totalColumns: number;
  hasFooter: boolean;
}

export type { TanstackTable };
