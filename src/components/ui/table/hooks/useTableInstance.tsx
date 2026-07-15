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
import { ChevronDown, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { Checkbox } from "../../checkbox";
import {
  type PaginationOptions,
  type SelectionMode,
  type TableInstanceResult,
  type TableProps,
} from "../Table.types";
import { useTableState } from "./useTableState";

const resolveSelectionMode = (selection: SelectionMode | undefined) => {
  if (!selection) return { enabled: false, multi: false };
  if (selection === "single") return { enabled: true, multi: false };

  return { enabled: true, multi: true };
};

const resolvePagination = (
  pagination: boolean | PaginationOptions | undefined,
) => {
  if (!pagination)
    return { enabled: false, manual: false, pageSize: 10, pageIndex: 0 };

  if (pagination === true) {
    return { enabled: true, manual: false, pageSize: 10, pageIndex: 0 };
  }

  return {
    enabled: true,
    manual: "pageCount" in pagination && pagination.pageCount != null,
    pageSize: pagination.pageSize ?? 10,
    pageIndex: pagination.pageIndex ?? 0,
    pageCount: pagination.pageCount,
  };
};

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

  const columnFilteringEnabled =
    columnFilters !== undefined || onColumnFiltersChange !== undefined;
  const clientFilteringEnabled =
    !manualFiltering && (globalFilter !== undefined || columnFilteringEnabled);

  const selMode = resolveSelectionMode(selection);
  const pag = resolvePagination(pagination);
  const hasExpandable = !!(getSubRows || renderSubComponent);
  const checkboxSize = size === "lg" ? "md" : "sm";

  const expandColumn = useMemo<ColumnDef<TData, unknown>>(
    () => ({
      id: "__expand__",
      size: 40,
      header: () => null,
      cell: ({ row }) => {
        if (!row.getCanExpand()) return null;

        return (
          <button
            type="button"
            className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-accent transition-colors cursor-pointer"
            onClick={e => {
              e.stopPropagation();
              row.toggleExpanded();
            }}
            aria-label={row.getIsExpanded() ? "Collapse" : "Expand"}
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        );
      },
      enableSorting: false,
      enableGlobalFilter: false,
      enableColumnFilter: false,
      enableHiding: false,
    }),
    [],
  );

  const selectionColumn = useMemo<ColumnDef<TData, unknown>>(
    () => ({
      id: "__selection__",
      size: 32,
      header: selMode.multi
        ? ({ table }) => (
            <Checkbox
              size={checkboxSize}
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={table.getIsSomePageRowsSelected()}
              onCheckedChange={v => table.toggleAllPageRowsSelected(!!v)}
              aria-label="Select all"
            />
          )
        : undefined,
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
      enableHiding: false,
    }),
    [checkboxSize, selMode.multi],
  );

  const effectiveColumns = useMemo(() => {
    const cols: ColumnDef<TData, any>[] = [];

    if (hasExpandable) cols.push(expandColumn);
    if (selMode.enabled) cols.push(selectionColumn);
    cols.push(...columns);

    return cols;
  }, [hasExpandable, expandColumn, selMode.enabled, selectionColumn, columns]);

  const hasFaceted = useMemo(
    () =>
      columns.some(
        col =>
          col.meta?.filter?.type === "text" &&
          (col.meta.filter as { faceted?: boolean }).faceted,
      ),
    [columns],
  );

  const table = useReactTable<TData>({
    data,
    columns: effectiveColumns,
    getRowId,
    getSubRows,
    state: {
      ...(sorting && { sorting: state.sorting }),
      ...(globalFilter !== undefined && { globalFilter }),
      ...(selMode.enabled && { rowSelection: state.rowSelection }),
      ...(columnFilteringEnabled && { columnFilters: state.columnFilters }),
      ...(pag.enabled && { pagination: state.pagination }),
      ...(hasExpandable && { expanded: state.expanded }),
    },
    enableRowSelection: selMode.enabled,
    enableMultiRowSelection: selMode.multi,
    onRowSelectionChange: selMode.enabled
      ? state.onRowSelectionChange
      : undefined,
    onSortingChange: sorting ? state.onSortingChange : undefined,
    onGlobalFilterChange,
    onColumnFiltersChange: columnFilteringEnabled
      ? state.onColumnFiltersChange
      : undefined,
    onPaginationChange: pag.enabled ? state.onPaginationChange : undefined,
    onExpandedChange: hasExpandable ? state.onExpandedChange : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel:
      sorting && !manualSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: clientFilteringEnabled
      ? getFilteredRowModel()
      : undefined,
    getPaginationRowModel:
      pag.enabled && !pag.manual ? getPaginationRowModel() : undefined,
    getExpandedRowModel: hasExpandable ? getExpandedRowModel() : undefined,
    getRowCanExpand: renderSubComponent && !getSubRows ? () => true : undefined,
    manualSorting,
    manualFiltering,
    manualPagination: pag.manual,
    ...(pag.manual && pag.pageCount != null
      ? { pageCount: pag.pageCount }
      : {}),
    enableColumnResizing: !!resizable,
    columnResizeMode: "onChange",
    ...(hasFaceted && !manualFiltering
      ? {
          getFacetedRowModel: getFacetedRowModel(),
          getFacetedUniqueValues: getFacetedUniqueValues(),
        }
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
