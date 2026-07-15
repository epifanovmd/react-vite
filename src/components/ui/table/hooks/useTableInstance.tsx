import {
  type ColumnDef,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useRef } from "react";

import { buildRowActionsColumn } from "../columns";
import type { TableInstanceResult, TableProps } from "../Table.types";
import type { PagConfig,SelMode } from "../utils";
import { hasFacetedFilter, resolvePagination, resolveSelectionMode } from "../utils";
import { useTableState } from "./useTableState";

export const useTableInstance = <TData,>(
  props: TableProps<TData>,
): TableInstanceResult<TData> => {
  const {
    data,
    columns,
    size,
    getRowId,
    sorting,
    sortingState,
    onSortingChange,
    manualSorting,
    globalFilter,
    onGlobalFilterChange,
    selection,
    rowSelection,
    onRowSelectionChange,
    onSelectedRowsChange,
    columnFilters,
    onColumnFiltersChange,
    manualFiltering,
    pagination,
    paginationState,
    onPaginationChange,
    resizable,
    getSubRows,
    renderSubComponent,
    expandedState,
    onExpandedChange,
  } = props;

  const state = useTableState({
    sortingState,
    onSortingChange,
    rowSelection,
    onRowSelectionChange,
    columnFilters,
    onColumnFiltersChange,
    paginationState,
    onPaginationChange,
    expandedState,
    onExpandedChange,
  });

  const selMode = resolveSelectionMode(selection);
  const pag = resolvePagination(pagination);
  const enableColumnFilters =
    columnFilters !== undefined || onColumnFiltersChange !== undefined;
  const enableClientFilter =
    !manualFiltering && (globalFilter !== undefined || enableColumnFilters);
  const hasExpandable = !!(getSubRows || renderSubComponent);
  const checkboxSize = size === "lg" ? "md" : "sm";

  const effectiveColumns = useMemo(() => {
    const cols: ColumnDef<TData>[] = [];

    if (hasExpandable || selMode.enabled) {
      cols.push(
        buildRowActionsColumn<TData>({
          checkboxSize,
          selectionEnabled: selMode.enabled,
          multiSelect: selMode.multi,
        }),
      );
    }
    cols.push(...columns);

    return cols;
  }, [hasExpandable, selMode, checkboxSize, columns]);

  const table = useReactTable<TData>({
    data,
    columns: effectiveColumns,
    getRowId,
    getSubRows,

    state: {
      ...(sorting && { sorting: state.sorting }),
      ...(globalFilter !== undefined && { globalFilter }),
      ...(selMode.enabled && { rowSelection: state.rowSelection }),
      ...(enableColumnFilters && { columnFilters: state.columnFilters }),
      ...(pag.enabled && { pagination: state.pagination }),
      ...(hasExpandable && { expanded: state.expanded }),
    },

    enableRowSelection: selMode.enabled,
    enableMultiRowSelection: selMode.multi,
    enableColumnResizing: !!resizable,
    columnResizeMode: "onChange",

    onRowSelectionChange: selMode.enabled
      ? state.onRowSelectionChange
      : undefined,
    onSortingChange: sorting ? state.onSortingChange : undefined,
    onGlobalFilterChange,
    onColumnFiltersChange: enableColumnFilters
      ? state.onColumnFiltersChange
      : undefined,
    onPaginationChange: pag.enabled ? state.onPaginationChange : undefined,
    onExpandedChange: hasExpandable ? state.onExpandedChange : undefined,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel:
      sorting && !manualSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableClientFilter ? getFilteredRowModel() : undefined,
    getPaginationRowModel:
      pag.enabled && !pag.manual ? getPaginationRowModel() : undefined,
    getExpandedRowModel: hasExpandable ? getExpandedRowModel() : undefined,
    getRowCanExpand: renderSubComponent && !getSubRows ? () => true : undefined,
    ...(hasFacetedFilter(columns) && !manualFiltering
      ? {
          getFacetedRowModel: getFacetedRowModel(),
          getFacetedUniqueValues: getFacetedUniqueValues(),
        }
      : {}),

    manualSorting,
    manualFiltering,
    manualPagination: pag.manual,
    ...(pag.manual && pag.pageCount != null
      ? { pageCount: pag.pageCount }
      : {}),
  });

  const onSelectedRowsChangeRef = useRef(onSelectedRowsChange);

  onSelectedRowsChangeRef.current = onSelectedRowsChange;

  useEffect(() => {
    if (!onSelectedRowsChangeRef.current || !selMode.enabled) return;
    onSelectedRowsChangeRef.current(
      table.getSelectedRowModel().rows.map(r => r.original),
    );
  }, [state.rowSelection, selMode.enabled, table]);

  const rows = pag.enabled
    ? table.getRowModel().rows
    : table.getCoreRowModel().rows;
  const totalColumns = table.getVisibleLeafColumns().length;
  const hasFooter = table
    .getFooterGroups()
    .some(fg => fg.headers.some(h => h.column.columnDef.footer));

  return { table, rows, totalColumns, hasFooter };
};
