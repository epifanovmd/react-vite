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

  const onSelectedRowsChange = useCallback(
    (rows: Order[]) => setSelectedOrders(rows),
    [],
  );

  const orders = useMemo(() => {
    return getClientOrders(search);
  }, [search]);

  return {
    orders,
    search,
    onSearchChange,
    sorting,
    onSortingChange: setSorting,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    columnFilters,
    onColumnFiltersChange: setColumnFilters,
    selectedOrders,
    onSelectedRowsChange,
  };
};
