import {
  getPaginationRowModel,
  type OnChangeFn,
  type PaginationState,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { useControllableState } from "./shared/useControllableState";
import type { TableFeatureResult } from "./types";

const DEFAULT_PAGE_SIZE = 10;

export interface PaginationFeatureMeta {
  pageSizeOptions: number[];
}

export interface PaginationFeatureOptions {
  enabled?: boolean;
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;
  rowCount?: number;
  pageSizeOptions?: number[];
  onPaginationChange?: (state: PaginationState) => void;
  manualPagination?: boolean;
  autoResetPageIndex?: boolean;
}

export const usePaginationFeature = <TData>(
  options: PaginationFeatureOptions = {},
): TableFeatureResult<TData, PaginationFeatureMeta> => {
  const {
    enabled = true,
    pageIndex,
    pageSize,
    pageCount,
    rowCount,
    pageSizeOptions = [10, 20, 50, 100],
    onPaginationChange,
    manualPagination,
    autoResetPageIndex,
  } = options;

  const isControlled = !!onPaginationChange;

  const controlledValue = useMemo<PaginationState | undefined>(() => {
    if (!isControlled) return undefined;

    return {
      pageIndex: pageIndex ?? 0,
      pageSize: pageSize ?? DEFAULT_PAGE_SIZE,
    };
  }, [isControlled, pageIndex, pageSize]);

  const defaultValue = useMemo<PaginationState>(
    () => ({
      pageIndex: pageIndex ?? 0,
      pageSize: pageSize ?? DEFAULT_PAGE_SIZE,
    }),
    // Only used to seed uncontrolled internal state on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [state, setState] = useControllableState<PaginationState>({
    value: controlledValue,
    defaultValue,
    onChange: onPaginationChange,
  });

  return useMemo(
    () => ({
      kind: "pagination" as const,
      state: enabled ? { pagination: state } : {},
      options: {
        manualPagination,
        autoResetPageIndex,
        pageCount,
        rowCount,
        onPaginationChange: enabled ? setState : undefined,
        getPaginationRowModel:
          enabled && !manualPagination ? getPaginationRowModel() : undefined,
      },
      meta: { pageSizeOptions },
    }),
    [
      enabled,
      state,
      setState,
      manualPagination,
      autoResetPageIndex,
      pageCount,
      rowCount,
      pageSizeOptions,
    ],
  );
};
