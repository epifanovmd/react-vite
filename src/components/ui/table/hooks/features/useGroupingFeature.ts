import {
  getGroupedRowModel,
  type GroupingState,
  type OnChangeFn,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { useControllableState } from "./shared/useControllableState";
import type { TableFeatureResult } from "./types";

export interface GroupingFeatureOptions {
  enabled?: boolean;
  groupingState?: GroupingState;
  defaultGrouping?: GroupingState;
  onGroupingChange?: (state: GroupingState) => void;
}

export const useGroupingFeature = <TData>(
  options: GroupingFeatureOptions = {},
): TableFeatureResult<TData> => {
  const {
    enabled = true,
    groupingState,
    defaultGrouping,
    onGroupingChange,
  } = options;

  const [state, setState] = useControllableState<GroupingState>({
    value: groupingState,
    defaultValue: defaultGrouping ?? [],
    onChange: onGroupingChange,
  });

  return useMemo(
    () => ({
      kind: "grouping" as const,
      state: { grouping: state },
      options: {
        enableGrouping: enabled,
        onGroupingChange: enabled ? setState : undefined,
        getGroupedRowModel: enabled ? getGroupedRowModel() : undefined,
      },
    }),
    [state, setState, enabled],
  );
};
