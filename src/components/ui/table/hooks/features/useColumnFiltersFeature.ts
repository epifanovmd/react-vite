import {
  type ColumnFiltersState,
  getFilteredRowModel,
  type OnChangeFn,
} from "@tanstack/react-table";
import { useCallback, useMemo } from "react";

import { useControllableState } from "./shared/useControllableState";
import type { TableFeatureResult } from "./types";

export interface ColumnFiltersFeatureOptions<TFilter> {
  enabled?: boolean;
  columnFilters?: Partial<TFilter>;
  defaultColumnFilters?: Partial<TFilter>;
  onColumnFiltersChange?: (state: Partial<TFilter>) => void;
  manualFiltering?: boolean;
}

const toColumnFiltersState = <T>(
  map: Partial<T> | undefined,
): ColumnFiltersState => {
  if (!map) return [];

  return Object.entries(map as Record<string, unknown>)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([id, value]) => ({ id, value }));
};

const toFilterMap = <T>(state: ColumnFiltersState): Partial<T> =>
  Object.fromEntries(state.map(f => [f.id, f.value])) as Partial<T>;

export const useColumnFiltersFeature = <
  TData,
  TFilter = Record<string, unknown>,
>(
  options: ColumnFiltersFeatureOptions<TFilter> = {},
): TableFeatureResult<TData> => {
  const {
    enabled = true,
    columnFilters,
    defaultColumnFilters,
    onColumnFiltersChange,
    manualFiltering,
  } = options;

  const defaultValue = useMemo(
    () => toColumnFiltersState(defaultColumnFilters),
    // Only used to seed uncontrolled internal state on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const controlledValue = useMemo(
    () =>
      columnFilters !== undefined
        ? toColumnFiltersState(columnFilters)
        : undefined,
    [columnFilters],
  );

  const handleChange = useCallback(
    (next: ColumnFiltersState) =>
      onColumnFiltersChange?.(toFilterMap<TFilter>(next)),
    [onColumnFiltersChange],
  );

  const [state, setState] = useControllableState<ColumnFiltersState>({
    value: controlledValue,
    defaultValue,
    onChange: handleChange,
  });

  return useMemo(
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
};
