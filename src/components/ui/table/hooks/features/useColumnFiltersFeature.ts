import {
  type ColumnDef,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useCallback, useMemo } from "react";

import type { ColumnFilterConfig, LabeledValue } from "../../Table.types";
import { useControllableState } from "./shared/useControllableState";
import type { TableFeatureResult } from "./types";

export const getColumnDefId = (column: ColumnDef<any, any>): string | undefined =>
  column.id ?? (column as { accessorKey?: string }).accessorKey;

const getQueryKey = (column: ColumnDef<any, any>): string | undefined => {
  const filter = column.meta?.filter as ColumnFilterConfig | undefined;

  return filter?.queryKey ?? getColumnDefId(column);
};

const toColumnFiltersState = <T,>(
  columns: ColumnDef<any, any>[],
  map: Partial<T> | undefined,
): ColumnFiltersState => {
  if (!map) return [];

  const state: ColumnFiltersState = [];

  for (const column of columns) {
    const id = getColumnDefId(column);
    const queryKey = getQueryKey(column);

    if (!id || !queryKey) continue;

    const value = (map as Record<string, unknown>)[queryKey];

    if (value !== undefined && value !== null) state.push({ id, value });
  }

  return state;
};

const toFilterMap = <T,>(
  columns: ColumnDef<any, any>[],
  filters: ColumnFiltersState,
): Partial<T> => {
  const map: Record<string, unknown> = {};

  for (const filter of filters) {
    const column = columns.find(c => getColumnDefId(c) === filter.id);
    const queryKey = (column && getQueryKey(column)) ?? filter.id;

    map[queryKey] = filter.value;
  }

  return map as Partial<T>;
};

// --- typed filter declarations, keyed by column id -------------------------

type UnwrapArray<T> = T extends (infer U)[] ? U : T;

type UnwrapLabeledValue<T> = T extends LabeledValue<infer V> ? V : T;

// Element type once both the array and the label-in-value wrappers are
// peeled off, e.g. `OrderStatus[]` and `LabeledValue<OrderStatus>[]` both
// resolve to `OrderStatus` here.
type FilterFieldValue<TQuery, K extends keyof TQuery> = UnwrapLabeledValue<
  UnwrapArray<NonNullable<TQuery[K]>>
>;

// Whether the field itself holds a list of values (drives text/select vs.
// multiselect) and whether its element is a `LabeledValue` (drives
// `labelInValue`) are tracked independently so both get checked.
type IsArrayField<TQuery, K extends keyof TQuery> =
  NonNullable<TQuery[K]> extends readonly unknown[] ? true : false;

type IsLabeledField<TQuery, K extends keyof TQuery> =
  UnwrapArray<NonNullable<TQuery[K]>> extends LabeledValue<any> ? true : false;

type LabelInValueFlag<Labeled extends boolean> = Labeled extends true
  ? { labelInValue: true }
  : { labelInValue?: false };

type TextConfig = Extract<ColumnFilterConfig, { type: "text" }>;

type SelectConfig<T> = Omit<
  Extract<ColumnFilterConfig<T>, { type: "select" }>,
  "labelInValue"
>;

type MultiSelectConfig<T> = Omit<
  Extract<ColumnFilterConfig<T>, { type: "multiselect" }>,
  "labelInValue"
>;

// Scalar field (e.g. `customer: string`): `multiselect` makes no sense, and
// `text` only makes sense for a plain value, not a `LabeledValue` one.
type ScalarFilterConfig<T, Labeled extends boolean> = Labeled extends true
  ? SelectConfig<T> & { labelInValue: true }
  : TextConfig | (SelectConfig<T> & { labelInValue?: false });

// Array field (e.g. `statuses: OrderStatus[]`): only `multiselect` produces
// an array value, so `text`/`select` are rejected here.
type ArrayFilterConfig<T, Labeled extends boolean> = MultiSelectConfig<T> &
  LabelInValueFlag<Labeled>;

type QueryFilterConfig<TQuery, K extends keyof TQuery & string> = {
  /** Field of the external query/state this filter reads and writes. */
  queryKey: K;
} & (IsArrayField<TQuery, K> extends true
  ? ArrayFilterConfig<FilterFieldValue<TQuery, K>, IsLabeledField<TQuery, K>>
  : ScalarFilterConfig<FilterFieldValue<TQuery, K>, IsLabeledField<TQuery, K>>);

// Union over every possible queryKey, discriminated by the literal `queryKey`
// field, so a column can point at any query field while still getting the
// matching option/value typing for that field.
export type TableFilterFieldConfig<TQuery> = {
  [K in keyof TQuery & string]: QueryFilterConfig<TQuery, K>;
}[keyof TQuery & string];

// Keyed by column id (accessorKey), NOT by query field: renaming or removing
// a column key makes this map fail to type-check, so a stale filter can't
// silently point at a column that no longer exists.
export type TableFiltersConfig<TData, TQuery> = {
  [K in keyof TData & string]?: TableFilterFieldConfig<TQuery>;
};

const mergeFiltersIntoColumns = <TData,>(
  columns: ColumnDef<TData, any>[],
  filters: Record<string, ColumnFilterConfig | undefined>,
): ColumnDef<TData, any>[] =>
  columns.map(column => {
    const id = getColumnDefId(column);
    const filter = id ? filters[id] : undefined;

    return filter ? { ...column, meta: { ...column.meta, filter } } : column;
  });

// --- public hook -------------------------------------------------------

export interface ColumnFiltersFeatureOptions<TData, TFilter> {
  enabled?: boolean;
  columns: ColumnDef<TData, any>[];
  filters?: TableFiltersConfig<TData, TFilter>;
  columnFilters?: Partial<TFilter>;
  defaultColumnFilters?: Partial<TFilter>;
  onColumnFiltersChange?: (state: Partial<TFilter>) => void;
  manualFiltering?: boolean;
}

export interface ColumnFiltersFeatureResult<TData, TFilter> {
  columns: ColumnDef<TData, any>[];
  feature: TableFeatureResult<TData>;
}

/**
 * Attaches typed filter declarations to columns by column id and drives the
 * resulting column-filters state. Single entry point for column filtering:
 * pass the base columns plus a typed `filters` map and get back the
 * annotated columns (for the table) and the feature (for `features`).
 */
export const useColumnFiltersFeature = <TData, TFilter = Record<string, unknown>>(
  options: ColumnFiltersFeatureOptions<TData, TFilter>,
): ColumnFiltersFeatureResult<TData, TFilter> => {
  const {
    enabled = true,
    columns,
    filters,
    columnFilters,
    defaultColumnFilters,
    onColumnFiltersChange,
    manualFiltering,
  } = options;

  const filteredColumns = useMemo(
    () =>
      filters
        ? mergeFiltersIntoColumns<TData>(
            columns,
            filters as Record<string, ColumnFilterConfig | undefined>,
          )
        : columns,
    [columns, filters],
  );

  const defaultValue = useMemo(
    () => toColumnFiltersState(filteredColumns, defaultColumnFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const controlledValue = useMemo(
    () =>
      columnFilters !== undefined
        ? toColumnFiltersState(filteredColumns, columnFilters)
        : undefined,
    [filteredColumns, columnFilters],
  );

  const handleChange = useCallback(
    (next: ColumnFiltersState) =>
      onColumnFiltersChange?.(toFilterMap<TFilter>(filteredColumns, next)),
    [filteredColumns, onColumnFiltersChange],
  );

  const [state, setState] = useControllableState<ColumnFiltersState>({
    value: controlledValue,
    defaultValue,
    onChange: handleChange,
  });

  const feature = useMemo<TableFeatureResult<TData>>(
    () => ({
      kind: "columnFilters" as const,
      state: { columnFilters: state },
      options: {
        enableColumnFilters: enabled,
        onColumnFiltersChange: enabled ? setState : undefined,
        manualFiltering,
        getFilteredRowModel:
          enabled && !manualFiltering ? getFilteredRowModel() : undefined,
      },
    }),
    [state, setState, enabled, manualFiltering],
  );

  return useMemo(
    () => ({ columns: filteredColumns, feature }),
    [filteredColumns, feature],
  );
};
