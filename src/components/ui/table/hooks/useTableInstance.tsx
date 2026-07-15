import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Checkbox } from "../../checkbox";
import { type TableProps } from "../Table.types";
import { type TableInstanceResult } from "../Table.types";
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
  } = props;

  const state = useTableState({
    sortingState,
    onSortingChange,
    rowSelection,
    onRowSelectionChange,
    columnFilters,
    onColumnFiltersChange,
  });

  // Фильтрация по колонкам включена, если родитель передал controlled-стейт
  // или колбэк (охватывает и server-, и client-режим).
  const columnFilteringEnabled =
    columnFilters !== undefined || onColumnFiltersChange !== undefined;

  // Общий флаг: применяется ли хоть какая-то фильтрация на клиенте.
  const clientFilteringEnabled =
    !manualFiltering && (globalFilter !== undefined || columnFilteringEnabled);

  const checkboxSize = size === "lg" ? "md" : "sm";

  const selectionColumn = React.useMemo<ColumnDef<TData, unknown>>(
    () => ({
      id: "__selection__",
      size: 32,
      header: ({ table }) => (
        <Checkbox
          size={checkboxSize}
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={v => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          size={checkboxSize}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={v => row.toggleSelected(!!v)}
          aria-label="Select row"
          onClick={e => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableGlobalFilter: false,
      enableColumnFilter: false,
    }),
    [checkboxSize],
  );

  const effectiveColumns = React.useMemo(
    () => (selection ? [selectionColumn, ...columns] : columns),
    [selection, selectionColumn, columns],
  );

  const table = useReactTable<TData>({
    data,
    columns: effectiveColumns,
    getRowId,
    state: {
      ...(sorting && { sorting: state.sorting }),
      ...(globalFilter !== undefined && { globalFilter }),
      ...(selection && { rowSelection: state.rowSelection }),
      ...(columnFilteringEnabled && { columnFilters: state.columnFilters }),
    },
    enableRowSelection: selection,
    onRowSelectionChange: selection ? state.onRowSelectionChange : undefined,
    onSortingChange: sorting ? state.onSortingChange : undefined,
    onGlobalFilterChange,
    onColumnFiltersChange: columnFilteringEnabled
      ? state.onColumnFiltersChange
      : undefined,
    getCoreRowModel: getCoreRowModel(),
    // В manual-режиме сортировку/фильтрацию делает сервер — не подключаем
    // клиентские row-модели, чтобы не дублировать поверх серверного результата.
    getSortedRowModel:
      sorting && !manualSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: clientFilteringEnabled
      ? getFilteredRowModel()
      : undefined,
    manualSorting,
    manualFiltering,
  });

  const onSelectedRowsChangeRef = React.useRef(onSelectedRowsChange);

  onSelectedRowsChangeRef.current = onSelectedRowsChange;

  React.useEffect(() => {
    if (!onSelectedRowsChangeRef.current || !selection) return;
    onSelectedRowsChangeRef.current(
      table.getSelectedRowModel().rows.map(r => r.original),
    );
  }, [state.rowSelection, selection, table]);

  const rows = table.getRowModel().rows;
  const totalColumns = table.getVisibleLeafColumns().length;
  const hasFooter = table
    .getFooterGroups()
    .some(fg => fg.headers.some(h => h.column.columnDef.footer));

  return { table, rows, totalColumns, hasFooter };
};
