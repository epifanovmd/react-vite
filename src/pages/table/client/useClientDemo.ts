import type {
  OnChangeFn,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

import { getClientOrders } from "../table.mock";
import type { Order, OrderStatus } from "../table.types";

/** Типизированная карта фильтров колонок — ключи соответствуют accessorKey колонок. */
interface OrderFilters {
  customer?: string;
  status?: OrderStatus[];
}

export interface ClientDemoViewModel {
  orders: Order[];
  search: string;
  onSearchChange: (value: string) => void;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  columnFilters: OrderFilters;
  onColumnFiltersChange: OnChangeFn<OrderFilters>;
  selectedOrders: Order[];
  onSelectedRowsChange: (rows: Order[]) => void;
}

export const useClientDemo = (): ClientDemoViewModel => {
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "amount", desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<OrderFilters>({});
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);

  const onSearchChange = useCallback((value: string) => setSearch(value), []);

  const onRowSelectionChange = useCallback<OnChangeFn<RowSelectionState>>(
    updater =>
      setRowSelection(prev =>
        typeof updater === "function" ? updater(prev) : updater,
      ),
    [],
  );

  const onColumnFiltersChange = useCallback<OnChangeFn<OrderFilters>>(
    updater =>
      setColumnFilters(prev =>
        typeof updater === "function" ? updater(prev) : updater,
      ),
    [],
  );

  const onSelectedRowsChange = useCallback(
    (rows: Order[]) => setSelectedOrders(rows),
    [],
  );

  const orders = useMemo(() => {
    const sortBy = sorting[0]?.id ?? "";
    const sortDesc = sorting[0]?.desc ?? false;

    return getClientOrders(search, sortBy, sortDesc);
  }, [search, sorting]);

  return {
    orders,
    search,
    onSearchChange,
    sorting,
    onSortingChange: setSorting,
    rowSelection,
    onRowSelectionChange,
    columnFilters,
    onColumnFiltersChange,
    selectedOrders,
    onSelectedRowsChange,
  };
};
