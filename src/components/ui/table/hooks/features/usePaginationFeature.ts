import {
  getPaginationRowModel,
  type PaginationState,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { useControllableState } from "./shared/useControllableState";
import type { TableFeatureResult } from "./types";

const DEFAULT_PAGE_SIZE = 20;

export type PaginationFeatureMode = "pagination" | "infiniteScroll";

export interface PaginationFeatureMeta {
  pageSizeOptions: number[];
  mode: PaginationFeatureMode;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  rootMargin: string;
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

  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  rootMargin?: string;
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
    hasNextPage = false,
    isFetchingNextPage = false,
    onLoadMore,
    rootMargin = "200px",
  } = options;

  const infiniteScroll = enabled && !!onLoadMore;

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
      state: enabled && !infiniteScroll ? { pagination: state } : {},
      options: infiniteScroll
        ? {}
        : {
            manualPagination,
            autoResetPageIndex,
            pageCount,
            rowCount,
            onPaginationChange: enabled ? setState : undefined,
            getPaginationRowModel:
              enabled && !manualPagination
                ? getPaginationRowModel()
                : undefined,
          },
      meta: {
        pageSizeOptions,
        mode: infiniteScroll ? "infiniteScroll" : "pagination",
        hasNextPage: infiniteScroll && hasNextPage,
        isFetchingNextPage: infiniteScroll && isFetchingNextPage,
        onLoadMore: onLoadMore ?? (() => {}),
        rootMargin,
      },
    }),
    [
      enabled,
      infiniteScroll,
      state,
      setState,
      manualPagination,
      autoResetPageIndex,
      pageCount,
      rowCount,
      pageSizeOptions,
      hasNextPage,
      isFetchingNextPage,
      onLoadMore,
      rootMargin,
    ],
  );
};
