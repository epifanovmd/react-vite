import {
  type ColumnFiltersState,
  type ExpandedState,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";

interface UseTableStateOptions {
  sortingState?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
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

export const useTableState = ({
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
}: UseTableStateOptions): TableState => {
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});
  const [internalColumnFilters, setInternalColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    { pageIndex: 0, pageSize: 10 },
  );
  const [internalExpanded, setInternalExpanded] = useState<ExpandedState>({});

  return {
    sorting: sortingState ?? internalSorting,
    onSortingChange: onSortingChange ?? setInternalSorting,
    rowSelection: rowSelection ?? internalRowSelection,
    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,
    columnFilters: columnFilters ?? internalColumnFilters,
    onColumnFiltersChange: onColumnFiltersChange ?? setInternalColumnFilters,
    pagination: paginationState ?? internalPagination,
    onPaginationChange: onPaginationChange ?? setInternalPagination,
    expanded: expandedState ?? internalExpanded,
    onExpandedChange: onExpandedChange ?? setInternalExpanded,
  };
};
