import {
  type ColumnPinningState,
  type OnChangeFn,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { useControllableState } from "./shared/useControllableState";
import type { TableFeatureResult } from "./types";

export interface ColumnPinningFeatureOptions {
  enabled?: boolean;
  columnPinningState?: ColumnPinningState;
  defaultColumnPinning?: ColumnPinningState;
  onColumnPinningChange?: (state: ColumnPinningState) => void;
}

export const useColumnPinningFeature = <TData>(
  options: ColumnPinningFeatureOptions = {},
): TableFeatureResult<TData> => {
  const {
    enabled = true,
    columnPinningState,
    defaultColumnPinning,
    onColumnPinningChange,
  } = options;

  const [state, setState] = useControllableState<ColumnPinningState>({
    value: columnPinningState,
    defaultValue: defaultColumnPinning ?? { left: [], right: [] },
    onChange: onColumnPinningChange,
  });

  return useMemo(
    () => ({
      kind: "columnPinning" as const,
      state: { columnPinning: state },
      options: {
        enableColumnPinning: enabled,
        onColumnPinningChange: enabled ? setState : undefined,
      },
    }),
    [state, setState, enabled],
  );
};
