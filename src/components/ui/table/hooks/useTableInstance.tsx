import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { buildExpandColumn, buildRowActionsColumn } from "../columns";
import type { TableInstanceResult, TableProps } from "../Table.types";
import { hasFacetedFilter } from "../utils";
import {
  type ExpandingFeatureMeta,
  mergeTableFeatures,
  type PaginationFeatureMeta,
  type RowSelectionFeatureMeta,
} from "./features";

export type UseTableInstanceOptions<TData> = Pick<
  TableProps<TData>,
  "data" | "columns" | "features" | "size" | "getRowId" | "tableOptions"
>;

export const useTableInstance = <TData,>(
  props: UseTableInstanceOptions<TData>,
): TableInstanceResult<TData> => {
  const { data, columns, features = [], size, getRowId, tableOptions } = props;

  const merged = useMemo(() => mergeTableFeatures(features), [features]);

  const selectionFeature = merged.byKind.get("rowSelection");
  const selectionEnabled = !!selectionFeature?.options.onRowSelectionChange;
  const multiSelect = !!(
    selectionFeature?.meta as RowSelectionFeatureMeta | undefined
  )?.multi;

  const expandingFeature = merged.byKind.get("expanding");
  const expandingEnabled = !!expandingFeature?.options.getExpandedRowModel;

  const sizingFeature = merged.byKind.get("columnSizing");
  const resizingEnabled = !!sizingFeature?.options.onColumnSizingChange;

  const pinningFeature = merged.byKind.get("columnPinning");
  const pinningEnabled = !!pinningFeature?.options.onColumnPinningChange;

  const sortingFeature = merged.byKind.get("sorting");
  const sortingEnabled = !!sortingFeature?.options.onSortingChange;

  const columnFiltersFeature = merged.byKind.get("columnFilters");
  const globalFilterFeature = merged.byKind.get("globalFilter");
  const filteringEnabled =
    !!columnFiltersFeature?.options.onColumnFiltersChange ||
    !!globalFilterFeature?.options.onGlobalFilterChange;

  const groupingEnabled = !!merged.options.getGroupedRowModel;

  const paginationFeature = merged.byKind.get("pagination");
  const paginationEnabled = !!paginationFeature?.options.onPaginationChange;
  const paginationMeta = paginationFeature?.meta as
    PaginationFeatureMeta | undefined;
  const renderSubComponent = (
    expandingFeature?.meta as ExpandingFeatureMeta<TData> | undefined
  )?.renderSubComponent;

  const checkboxSize = size === "lg" ? "md" : "sm";

  const effectiveColumns = useMemo(() => {
    const cols = [...columns];

    if (expandingEnabled) cols.unshift(buildExpandColumn<TData>());
    if (selectionEnabled) {
      cols.unshift(
        buildRowActionsColumn<TData>({
          checkboxSize,
          selectionEnabled,
          multiSelect,
        }),
      );
    }

    return cols;
  }, [columns, expandingEnabled, selectionEnabled, multiSelect, checkboxSize]);

  const { state: extraState, ...restTableOptions } = tableOptions ?? {};

  const table = useReactTable<TData>({
    data,
    columns: effectiveColumns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    ...(filteringEnabled && hasFacetedFilter(columns)
      ? {
          getFacetedRowModel: getFacetedRowModel(),
          getFacetedUniqueValues: getFacetedUniqueValues(),
        }
      : {}),
    ...merged.options,
    state: { ...merged.state, ...extraState },
    ...restTableOptions,
  });

  const rows = table.getRowModel().rows;
  const totalColumns = table.getVisibleLeafColumns().length;
  const hasFooter = table
    .getFooterGroups()
    .some(fg => fg.headers.some(h => h.column.columnDef.footer));

  return {
    table,
    rows,
    totalColumns,
    hasFooter,
    sortingEnabled,
    filteringEnabled,
    paginationEnabled,
    resizingEnabled,
    pinningEnabled,
    groupingEnabled,
    expandingEnabled,
    renderSubComponent,
    pageSizeOptions: paginationMeta?.pageSizeOptions,
  };
};
