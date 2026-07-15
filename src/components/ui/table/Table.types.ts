import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  OnChangeFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  Table as TanstackTable,
} from "@tanstack/react-table";
import type * as React from "react";

export interface ColumnFilterOption {
  value: string;
  label: React.ReactNode;
}

export type ColumnFilterConfig =
  | { type: "text"; placeholder?: string; faceted?: boolean }
  | { type: "select"; options: ColumnFilterOption[]; placeholder?: string }
  | { type: "multiselect"; options: ColumnFilterOption[] };

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    filter?: ColumnFilterConfig;
  }
}

export interface PaginationOptions {
  pageSize?: number;
  pageIndex?: number;
  pageCount?: number;
}

export type SelectionMode = boolean | "single" | "multi";

export interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];

  variant?: "default" | "striped" | "bordered";
  size?: "sm" | "md" | "lg";
  stickyHeader?: boolean;
  className?: string;
  containerClassName?: string;

  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  rowClassName?: string | ((row: TData) => string);

  sorting?: boolean;
  sortingState?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  manualSorting?: boolean;

  globalFilter?: string;
  onGlobalFilterChange?: OnChangeFn<string>;

  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  manualFiltering?: boolean;

  selection?: SelectionMode;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onSelectedRowsChange?: (rows: TData[]) => void;

  pagination?: boolean | PaginationOptions;
  paginationState?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;

  resizable?: boolean;

  getSubRows?: (row: TData) => TData[] | undefined;
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
  expandedState?: ExpandedState;
  onExpandedChange?: OnChangeFn<ExpandedState>;

  loading?: boolean;
  refreshing?: boolean;
  empty?: React.ReactNode;

  onRowClick?: (
    row: TData,
    event: React.MouseEvent<HTMLTableRowElement>,
  ) => void;
  onRowDoubleClick?: (
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
