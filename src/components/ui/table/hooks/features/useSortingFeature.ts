import {
  getSortedRowModel,
  type OnChangeFn,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { useControllableState } from "./shared/useControllableState";
import type { TableFeatureResult } from "./types";

export interface SortingFeatureOptions {
  enabled?: boolean;
  sortingState?: SortingState;
  defaultSorting?: SortingState;
  onSortingChange?: (state: SortingState) => void;
  manualSorting?: boolean;
  enableMultiSort?: boolean;
  enableSortingRemoval?: boolean;
  sortDescFirst?: boolean;
}

export const useSortingFeature = <TData>(
  options: SortingFeatureOptions = {},
): TableFeatureResult<TData> => {
  const {
    enabled = true,
    sortingState,
    defaultSorting,
    onSortingChange,
    manualSorting,
    enableMultiSort,
    enableSortingRemoval,
    sortDescFirst,
  } = options;

  const [sorting, setSorting] = useControllableState<SortingState>({
    value: sortingState,
    defaultValue: defaultSorting ?? [],
    onChange: onSortingChange,
  });

  return useMemo(
    () => ({
      kind: "sorting" as const,
      state: { sorting },
      options: {
        enableSorting: enabled,
        onSortingChange: enabled ? setSorting : undefined,
        manualSorting,
        enableMultiSort,
        enableSortingRemoval,
        sortDescFirst,
        getSortedRowModel:
          enabled && !manualSorting ? getSortedRowModel() : undefined,
      },
    }),
    [
      sorting,
      setSorting,
      enabled,
      manualSorting,
      enableMultiSort,
      enableSortingRemoval,
      sortDescFirst,
    ],
  );
};
