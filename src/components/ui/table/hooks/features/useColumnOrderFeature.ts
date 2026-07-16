import { type ColumnOrderState, type OnChangeFn } from "@tanstack/react-table";
import { useMemo } from "react";

import { useControllableState } from "./shared/useControllableState";
import type { TableFeatureResult } from "./types";

export interface ColumnOrderFeatureOptions {
  columnOrderState?: ColumnOrderState;
  defaultColumnOrder?: ColumnOrderState;
  onColumnOrderChange?: (state: ColumnOrderState) => void;
}

export const useColumnOrderFeature = <TData>(
  options: ColumnOrderFeatureOptions = {},
): TableFeatureResult<TData> => {
  const { columnOrderState, defaultColumnOrder, onColumnOrderChange } = options;

  const [state, setState] = useControllableState<ColumnOrderState>({
    value: columnOrderState,
    defaultValue: defaultColumnOrder ?? [],
    onChange: onColumnOrderChange,
  });

  return useMemo(
    () => ({
      kind: "columnOrder" as const,
      state: { columnOrder: state },
      options: { onColumnOrderChange: setState },
    }),
    [state, setState],
  );
};
