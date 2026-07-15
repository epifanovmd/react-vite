import {
  type ColumnFiltersState,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import * as React from "react";

interface UseTableStateOptions {
  sortingState?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
}

export interface TableState {
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
}

export const useTableState = ({
  sortingState,
  onSortingChange,
  rowSelection,
  onRowSelectionChange,
  columnFilters,
  onColumnFiltersChange,
}: UseTableStateOptions): TableState => {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>(
    [],
  );

  const [internalRowSelection, setInternalRowSelection] =
    React.useState<RowSelectionState>({});

  const [internalColumnFilters, setInternalColumnFilters] =
    React.useState<ColumnFiltersState>([]);

  return {
    sorting: sortingState ?? internalSorting,
    onSortingChange: onSortingChange ?? setInternalSorting,
    rowSelection: rowSelection ?? internalRowSelection,
    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,
    columnFilters: columnFilters ?? internalColumnFilters,
    onColumnFiltersChange:
      onColumnFiltersChange ?? setInternalColumnFilters,
  };
};
