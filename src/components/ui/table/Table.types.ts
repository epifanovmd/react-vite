import type {
  ColumnDef,
  ExpandedState,
  OnChangeFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  Table as TanstackTable,
} from "@tanstack/react-table";
import type * as React from "react";

export interface ColumnFilterOption<T = string> {
  value: T;
  label: React.ReactNode;
}

export type ColumnFilterConfig<T = string> =
  | { type: "text"; placeholder?: string; faceted?: boolean }
  | {
      type: "select";
      options?: ColumnFilterOption<T>[];
      fetchOptions?: (query: string) => Promise<ColumnFilterOption<T>[]>;
      placeholder?: string;
    }
  | {
      type: "multiselect";
      options?: ColumnFilterOption<T>[];
      fetchOptions?: (query: string) => Promise<ColumnFilterOption<T>[]>;
    };

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    filter?: ColumnFilterConfig<TValue>;
  }
}

export interface PaginationOptions {
  pageSize?: number;
  pageIndex?: number;
  pageCount?: number;
}

export type SelectionMode = boolean | "single" | "multi";

export interface TableProps<TData, TFilter = Record<string, unknown>> {
  data: TData[];
  columns: ColumnDef<TData>[];

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

  columnFilters?: Partial<TFilter>;
  onColumnFiltersChange?: OnChangeFn<Partial<TFilter>>;
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
