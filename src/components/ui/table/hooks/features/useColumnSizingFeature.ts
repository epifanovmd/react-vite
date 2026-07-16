import {
  type ColumnResizeDirection,
  type ColumnResizeMode,
  type ColumnSizingState,
  type OnChangeFn,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { useControllableState } from "./shared/useControllableState";
import type { TableFeatureResult } from "./types";

export interface ColumnSizingFeatureOptions {
  enabled?: boolean;
  columnSizingState?: ColumnSizingState;
  defaultColumnSizing?: ColumnSizingState;
  onColumnSizingChange?: (state: ColumnSizingState) => void;
  columnResizeMode?: ColumnResizeMode;
  columnResizeDirection?: ColumnResizeDirection;
}

export const useColumnSizingFeature = <TData>(
  options: ColumnSizingFeatureOptions = {},
): TableFeatureResult<TData> => {
  const {
    enabled = true,
    columnSizingState,
    defaultColumnSizing,
    onColumnSizingChange,
    columnResizeMode,
    columnResizeDirection,
  } = options;

  const [state, setState] = useControllableState<ColumnSizingState>({
    value: columnSizingState,
    defaultValue: defaultColumnSizing ?? {},
    onChange: onColumnSizingChange,
  });

  return useMemo(
    () => ({
      kind: "columnSizing" as const,
      state: { columnSizing: state },
      options: {
        enableColumnResizing: enabled,
        onColumnSizingChange: enabled ? setState : undefined,
        columnResizeMode: columnResizeMode ?? "onChange",
        columnResizeDirection,
      },
    }),
    [state, setState, enabled, columnResizeMode, columnResizeDirection],
  );
};
