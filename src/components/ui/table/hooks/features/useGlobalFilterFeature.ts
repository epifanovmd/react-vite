import {
  type FilterFnOption,
  getFilteredRowModel,
  type OnChangeFn,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { useControllableState } from "./shared/useControllableState";
import type { TableFeatureResult } from "./types";

export interface GlobalFilterFeatureOptions {
  enabled?: boolean;
  globalFilter?: string;
  defaultGlobalFilter?: string;
  onGlobalFilterChange?: (state: string) => void;
  globalFilterFn?: FilterFnOption<any>;
  manualFiltering?: boolean;
}

export const useGlobalFilterFeature = <TData>(
  options: GlobalFilterFeatureOptions = {},
): TableFeatureResult<TData> => {
  const {
    enabled = true,
    globalFilter,
    defaultGlobalFilter,
    onGlobalFilterChange,
    globalFilterFn,
    manualFiltering,
  } = options;

  const [state, setState] = useControllableState<string>({
    value: globalFilter,
    defaultValue: defaultGlobalFilter ?? "",
    onChange: onGlobalFilterChange,
  });

  return useMemo(
    () => ({
      kind: "globalFilter" as const,
      state: { globalFilter: state },
      options: {
        enableGlobalFilter: enabled,
        onGlobalFilterChange: enabled ? setState : undefined,
        globalFilterFn,
        getFilteredRowModel:
          enabled && !manualFiltering ? getFilteredRowModel() : undefined,
      },
    }),
    [state, setState, enabled, globalFilterFn, manualFiltering],
  );
};
