import {
  type ColumnFiltersState,
  type ExpandedState,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { useCallback, useMemo, useRef, useState } from "react";

/** Convert a typed filter object (Partial<TFilter>) to tanstack ColumnFiltersState. */
const toColumnFiltersState = <T>(
  map: Partial<T> | undefined,
): ColumnFiltersState => {
  if (map === undefined) return [];

  return Object.entries(map as Record<string, unknown>)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([id, value]) => ({ id, value }));
};

/** Convert tanstack ColumnFiltersState back to a typed filter object (Partial<TFilter>). */
const toFilterMap = <T>(
  arr: ColumnFiltersState,
): Partial<T> => {
  return Object.fromEntries(arr.map(f => [f.id, f.value])) as Partial<T>;
};

interface UseTableStateOptions<TFilter> {
  sortingState?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  columnFilters?: Partial<TFilter>;
  onColumnFiltersChange?: OnChangeFn<Partial<TFilter>>;
  paginationState?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  expandedState?: ExpandedState;
  onExpandedChange?: OnChangeFn<ExpandedState>;
}

export interface TableState {
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  expanded: ExpandedState;
  onExpandedChange: OnChangeFn<ExpandedState>;
}

export const useTableState = <TFilter = Record<string, unknown>>({
  sortingState,
  onSortingChange,
  rowSelection,
  onRowSelectionChange,
  columnFilters: columnFilterMap,
  onColumnFiltersChange: onColumnFilterMapChange,
  paginationState,
  onPaginationChange,
  expandedState,
  onExpandedChange,
}: UseTableStateOptions<TFilter>): TableState => {
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});
  const [internalColumnFilters, setInternalColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    { pageIndex: 0, pageSize: 10 },
  );
  const [internalExpanded, setInternalExpanded] = useState<ExpandedState>({});

  // Convert the typed filter object to ColumnFiltersState for controlled mode.
  // useMemo is critical — without it every render creates a new array reference,
  // which TanStack sees as a state change → re-render → loop.
  const externalColumnFilters = useMemo(
    () =>
      columnFilterMap !== undefined
        ? toColumnFiltersState(columnFilterMap)
        : undefined,
    [columnFilterMap],
  );

  // Effective: use controlled value or internal state
  const effectiveColumnFilters: ColumnFiltersState =
    externalColumnFilters ?? internalColumnFilters;

  // Save to a ref so the callback doesn't recreate on every render
  const effectiveColumnFiltersRef = useRef(effectiveColumnFilters);

  effectiveColumnFiltersRef.current = effectiveColumnFilters;

  // Wrapped handler: tanstack calls with ColumnFiltersState,
  // we forward a typed Partial<TFilter> to the consumer
  const handleColumnFiltersChange = useCallback<
    OnChangeFn<ColumnFiltersState>
  >(
    updaterOrValue => {
      const newState =
        typeof updaterOrValue === "function"
          ? updaterOrValue(effectiveColumnFiltersRef.current)
          : updaterOrValue;

      setInternalColumnFilters(newState);

      if (onColumnFilterMapChange) {
        const map = toFilterMap<TFilter>(newState);

        onColumnFilterMapChange(map);
      }
    },
    [onColumnFilterMapChange],
  );

  return {
    sorting: sortingState ?? internalSorting,
    onSortingChange: onSortingChange ?? setInternalSorting,
    rowSelection: rowSelection ?? internalRowSelection,
    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,
    columnFilters: effectiveColumnFilters,
    onColumnFiltersChange: handleColumnFiltersChange,
    pagination: paginationState ?? internalPagination,
    onPaginationChange: onPaginationChange ?? setInternalPagination,
    expanded: expandedState ?? internalExpanded,
    onExpandedChange: onExpandedChange ?? setInternalExpanded,
  };
};
