import { type IHolderError, usePaged } from "@store/holders";
import type {
  OnChangeFn,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchOrders } from "../table.mock";
import type {
  Order,
  OrderQuery,
  OrderSortField,
  OrderStatus,
} from "../table.types";

/** Типизированная карта фильтров колонок — ключи соответствуют accessorKey колонок. */
interface OrderFilters {
  customer?: string;
  status?: OrderStatus[];
}

const DEFAULT_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;
const SORTABLE_FIELDS: readonly OrderSortField[] = [
  "customer",
  "amount",
  "items",
  "createdAt",
];

const toServerSort = (
  sorting: SortingState,
): Pick<OrderQuery, "sortBy" | "sortDir"> => {
  const first = sorting[0];

  if (!first) return {};
  const sortBy = first.id as OrderSortField;

  if (!SORTABLE_FIELDS.includes(sortBy)) return {};

  return { sortBy, sortDir: first.desc ? "desc" : "asc" };
};

const toServerFilters = (
  filters: OrderFilters,
): Pick<OrderQuery, "customer" | "statuses"> => {
  return {
    customer: filters.customer?.trim() || undefined,
    statuses:
      filters.status && filters.status.length > 0 ? filters.status : undefined,
  };
};

export interface ServerDemoViewModel {
  orders: Order[];
  isLoading: boolean;
  isRefreshing: boolean;
  isBusy: boolean;
  isError: boolean;
  error: IHolderError | null;
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  reload: () => void;
  searchInput: string;
  search: string;
  onSearchInputChange: (value: string) => void;
  onClearSearch: () => void;
  onGlobalFilterChange: OnChangeFn<string>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  columnFilters: OrderFilters;
  onColumnFiltersChange: OnChangeFn<OrderFilters>;
  onSelectedRowsChange: (rows: Order[]) => void;
  selectedOrders: Order[];
  clearSelection: () => void;
  removeSelected: () => void;
  activeOrder: Order | null;
  onRowClick: (order: Order) => void;
  openDetails: (order: Order) => void;
  closeDetails: () => void;
  getRowId: (order: Order) => string;
}

export const useServerDemo = (): ServerDemoViewModel => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<OrderFilters>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(searchInput.trim()),
      SEARCH_DEBOUNCE_MS,
    );

    return () => clearTimeout(timer);
  }, [searchInput]);

  const query = useMemo<OrderQuery>(
    () => ({
      search: debouncedSearch,
      ...toServerSort(sorting),
      ...toServerFilters(columnFilters),
    }),
    [debouncedSearch, sorting, columnFilters],
  );

  const {
    items: orders,
    isLoading,
    isRefreshing,
    isBusy,
    isError,
    error,
    pagination,
    pageCount,
    goToPage,
    setPageSize,
    reload,
    removeItem,
  } = usePaged<Order, OrderQuery>({
    queryFn: fetchOrders,
    pageSize: DEFAULT_PAGE_SIZE,
    keyExtractor: order => order.id,
    watch: [query],
  });

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size);
      reload();
    },
    [setPageSize, reload],
  );

  const refresh = useCallback(() => {
    reload({ refresh: true });
  }, [reload]);

  const onSelectedRowsChange = useCallback(
    (rows: Order[]) => setSelectedOrders(rows),
    [],
  );
  const clearSelection = useCallback(() => {
    setRowSelection({});
    setSelectedOrders([]);
  }, []);
  const removeSelected = useCallback(() => {
    if (selectedOrders.length === 0) return;
    const ids = new Set(selectedOrders.map(order => order.id));

    removeItem(order => ids.has(order.id));
    setRowSelection({});
    setSelectedOrders([]);
  }, [selectedOrders, removeItem]);

  const onSearchInputChange = useCallback(
    (value: string) => setSearchInput(value),
    [],
  );
  const onClearSearch = useCallback(() => setSearchInput(""), []);
  const onGlobalFilterChange = useCallback<OnChangeFn<string>>(
    updater =>
      setSearchInput(
        typeof updater === "function" ? updater(debouncedSearch) : updater,
      ),
    [debouncedSearch],
  );

  const onRowClick = useCallback((order: Order) => setActiveOrder(order), []);
  const openDetails = useCallback((order: Order) => setActiveOrder(order), []);
  const closeDetails = useCallback(() => setActiveOrder(null), []);
  const getRowId = useCallback((order: Order) => order.id, []);

  return {
    orders,
    isLoading,
    isRefreshing,
    isBusy,
    isError,
    error,
    totalCount: pagination.totalCount,
    pageCount,
    currentPage: pagination.page,
    pageSize: pagination.pageSize,
    goToPage,
    setPageSize: handlePageSizeChange,
    reload: refresh,
    searchInput,
    search: debouncedSearch,
    onSearchInputChange,
    onClearSearch,
    onGlobalFilterChange,
    sorting,
    onSortingChange: setSorting,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    columnFilters,
    onColumnFiltersChange: setColumnFilters,
    onSelectedRowsChange,
    selectedOrders,
    clearSelection,
    removeSelected,
    activeOrder,
    onRowClick,
    openDetails,
    closeDetails,
    getRowId,
  };
};
