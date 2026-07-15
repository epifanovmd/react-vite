import type {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
  Table as TanstackTable,
} from "@tanstack/react-table";
import type * as React from "react";

// ─── Per-column filters ──────────────────────────────────────────────────────

/** Опция для select/multiselect фильтра колонки. */
export interface ColumnFilterOption {
  value: string;

  label: React.ReactNode;
}

/**
 * Конфиг фильтра колонки. Задаётся в `columnDef.meta.filter`.
 * Тип определяет UI в поповере хидера:
 * - `text` — инпут (с дебаунсом перед `column.setFilterValue`)
 * - `select` — одиночный выбор (clearable)
 * - `multiselect` — множественный выбор
 *
 * Для client-режима (без `manualFiltering`) на колонке стоит также задать
 * `filterFn` (`"includesString"` / `"equals"` / `"arrIncludesSome"`).
 * Для server-режима (`manualFiltering`) `filterFn` не нужен — фильтрацию
 * делает сервер по `columnFilters`, которые родитель пробрасывает в запрос.
 */
export type ColumnFilterConfig =
  | { type: "text"; placeholder?: string }
  | { type: "select"; options: ColumnFilterOption[]; placeholder?: string }
  | { type: "multiselect"; options: ColumnFilterOption[] };

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    filter?: ColumnFilterConfig;
  }
}


export interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];

  variant?: "default" | "striped" | "bordered";
  size?: "sm" | "md" | "lg";
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

  // Per-column filters
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  manualFiltering?: boolean;

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
