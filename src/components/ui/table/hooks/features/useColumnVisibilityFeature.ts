import { type OnChangeFn, type VisibilityState } from "@tanstack/react-table";
import { useMemo } from "react";

import { useControllableState } from "./shared/useControllableState";
import type { TableFeatureResult } from "./types";

export interface ColumnVisibilityFeatureOptions {
  columnVisibilityState?: VisibilityState;
  defaultColumnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (state: VisibilityState) => void;
}

export const useColumnVisibilityFeature = <TData>(
  options: ColumnVisibilityFeatureOptions = {},
): TableFeatureResult<TData> => {
  const {
    columnVisibilityState,
    defaultColumnVisibility,
    onColumnVisibilityChange,
  } = options;

  const [state, setState] = useControllableState<VisibilityState>({
    value: columnVisibilityState,
    defaultValue: defaultColumnVisibility ?? {},
    onChange: onColumnVisibilityChange,
  });

  return useMemo(
    () => ({
      kind: "columnVisibility" as const,
      state: { columnVisibility: state },
      options: { onColumnVisibilityChange: setState },
    }),
    [state, setState],
  );
};
