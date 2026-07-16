import {
  type OnChangeFn,
  type Row,
  type RowSelectionState,
} from "@tanstack/react-table";
import { useMemo } from "react";

import type { SelectionMode } from "../../Table.types";
import { resolveSelectionMode } from "../../utils";
import { useControllableState } from "./shared/useControllableState";
import type { TableFeatureResult } from "./types";

export interface RowSelectionFeatureMeta {
  multi: boolean;
}

export interface RowSelectionFeatureOptions<TData> {
  selection?: SelectionMode;
  rowSelection?: RowSelectionState;
  defaultRowSelection?: RowSelectionState;
  onRowSelectionChange?: (state: RowSelectionState) => void;
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  enableSubRowSelection?: boolean | ((row: Row<TData>) => boolean);
}

export const useRowSelectionFeature = <TData>(
  options: RowSelectionFeatureOptions<TData> = {},
): TableFeatureResult<TData, RowSelectionFeatureMeta> => {
  const {
    selection = "multi",
    rowSelection,
    defaultRowSelection,
    onRowSelectionChange,
    enableRowSelection,
    enableSubRowSelection,
  } = options;

  const mode = resolveSelectionMode(selection);

  const [state, setState] = useControllableState<RowSelectionState>({
    value: rowSelection,
    defaultValue: defaultRowSelection ?? {},
    onChange: onRowSelectionChange,
  });

  return useMemo(
    () => ({
      kind: "rowSelection" as const,
      state: { rowSelection: state },
      options: {
        enableRowSelection: mode.enabled && (enableRowSelection ?? true),
        enableMultiRowSelection: mode.enabled && mode.multi,
        enableSubRowSelection,
        onRowSelectionChange: mode.enabled ? setState : undefined,
      },
      meta: { multi: mode.multi },
    }),
    [
      state,
      setState,
      mode.enabled,
      mode.multi,
      enableRowSelection,
      enableSubRowSelection,
    ],
  );
};
