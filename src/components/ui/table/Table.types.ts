import type {
  ColumnDef,
  Row,
  Table as TanstackTable,
  TableOptions,
} from "@tanstack/react-table";
import type * as React from "react";

import type { TableFeatureResult } from "./hooks/features";

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

export type SelectionMode = boolean | "single" | "multi";

export interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  features?: TableFeatureResult<any, any>[];

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

  showColumnVisibility?: boolean;

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

  tableOptions?: Partial<TableOptions<TData>>;
}

export interface TableInstanceResult<TData = unknown> {
  table: TanstackTable<TData>;
  rows: Row<TData>[];
  totalColumns: number;
  hasFooter: boolean;
  sortingEnabled: boolean;
  filteringEnabled: boolean;
  paginationEnabled: boolean;
  resizingEnabled: boolean;
  pinningEnabled: boolean;
  groupingEnabled: boolean;
  expandingEnabled: boolean;
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
  pageSizeOptions?: number[];
}

export type { TanstackTable };
