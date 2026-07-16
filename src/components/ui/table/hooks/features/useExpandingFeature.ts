import {
  type ExpandedState,
  getExpandedRowModel,
  type OnChangeFn,
  type Row,
} from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { useControllableState } from "./shared/useControllableState";
import type { TableFeatureResult } from "./types";

export interface ExpandingFeatureMeta<TData> {
  renderSubComponent?: (props: { row: Row<TData> }) => ReactNode;
}

export interface ExpandingFeatureOptions<TData> {
  enabled?: boolean;
  expandedState?: ExpandedState;
  defaultExpanded?: ExpandedState;
  onExpandedChange?: (state: ExpandedState) => void;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  getSubRows?: (row: TData) => TData[] | undefined;
  renderSubComponent?: (props: { row: Row<TData> }) => ReactNode;
}

export const useExpandingFeature = <TData>(
  options: ExpandingFeatureOptions<TData> = {},
): TableFeatureResult<TData, ExpandingFeatureMeta<TData>> => {
  const {
    enabled = true,
    expandedState,
    defaultExpanded,
    onExpandedChange,
    getRowCanExpand,
    getSubRows,
    renderSubComponent,
  } = options;

  const [state, setState] = useControllableState<ExpandedState>({
    value: expandedState,
    defaultValue: defaultExpanded ?? {},
    onChange: onExpandedChange,
  });

  const resolvedGetRowCanExpand = useMemo(() => {
    if (getRowCanExpand) return getRowCanExpand;
    if (getSubRows) return (row: Row<TData>) => row.subRows.length > 0;
    if (renderSubComponent) return () => true;

    return undefined;
  }, [getRowCanExpand, getSubRows, renderSubComponent]);

  return useMemo(
    () => ({
      kind: "expanding" as const,
      state: { expanded: state },
      options: {
        onExpandedChange: enabled ? setState : undefined,
        getExpandedRowModel: enabled ? getExpandedRowModel() : undefined,
        getRowCanExpand: enabled ? resolvedGetRowCanExpand : undefined,
        getSubRows: enabled ? getSubRows : undefined,
      },
      meta: { renderSubComponent: enabled ? renderSubComponent : undefined },
    }),
    [
      state,
      setState,
      enabled,
      resolvedGetRowCanExpand,
      getSubRows,
      renderSubComponent,
    ],
  );
};
