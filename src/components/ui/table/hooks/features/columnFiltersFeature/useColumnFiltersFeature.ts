import {
  type ColumnDef,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useCallback, useMemo } from "react";

import type { ColumnFilterConfig } from "../../../Table.types";
import { useControllableState } from "../shared";
import type { TableFeatureResult } from "../types";
import type { TableFiltersConfig } from "./filterConfig.types";
import { toColumnFiltersState, toFilterMap } from "./filterState";
import { mergeFiltersIntoColumns } from "./mergeFiltersIntoColumns";

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

export const useColumnFiltersFeature = <
  TData,
  TFilter = Record<string, unknown>,
>(
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
