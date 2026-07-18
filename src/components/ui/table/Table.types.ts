import type {
  ColumnDef,
  Row,
  Table as TanstackTable,
  TableOptions,
} from "@tanstack/react-table";
import type * as React from "react";

import type { LabeledValue } from "../select";
import type {
  ColumnFilterConfig,
  ColumnFilterOption,
} from "./components/tableHeadFilter";
import type { TableFeatureResult } from "./hooks";

export type { ColumnFilterConfig, ColumnFilterOption, LabeledValue };

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
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  infiniteScrollRootMargin?: string;
}

export type { TanstackTable };
