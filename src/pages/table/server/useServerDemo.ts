import {
  useColumnFiltersFeature,
  useGlobalFilterFeature,
  usePaginationFeature,
  useRowSelectionFeature,
  useSortingFeature,
} from "@components/ui";
import { usePaged } from "@store/holders";
import type {
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchOrders } from "../table.mock";
import type { Order, OrderQuery, OrderSortField } from "../table.types";
import {
  createOrderColumns,
  orderFilterFields,
  STATUS_FILTER_OPTIONS,
} from "../tableColumns";

const DEFAULT_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;
const PAGE_SIZE_OPTIONS = [10, 20, 50];
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

const normalizeFilters = (
  filters: Partial<OrderQuery>,
): Pick<OrderQuery, "customer" | "statuses"> => ({
  customer: filters.customer?.trim() || undefined,
  statuses: filters.statuses?.length ? filters.statuses : undefined,
});

export type ServerDemoViewModel = ReturnType<typeof useServerDemo>;

export const useServerDemo = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<Partial<OrderQuery>>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  console.log("columnFilters", columnFilters);

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
      ...normalizeFilters(columnFilters),
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
  } = usePaged<Order, OrderQuery>({
    queryFn: fetchOrders,
    pageSize: DEFAULT_PAGE_SIZE,
    keyExtractor: order => order.id,
    watch: [query],
  });

  const onPaginationChange = useCallback(
    (v: PaginationState) => {
      const { pageIndex, pageSize } = v as PaginationState;

      if (pagination.pageSize !== pageSize) {
        setPageSize(pageSize);
      }
      goToPage(pageIndex + 1).then();
    },
    [goToPage, pagination.pageSize, setPageSize],
  );

  const refresh = useCallback(() => {
    reload({ refresh: true });
  }, [reload]);

  const onSearchInputChange = useCallback(
    (value: string) => setSearchInput(value),
    [],
  );
  const onClearSearch = useCallback(() => setSearchInput(""), []);

  const onGlobalFilterChange: OnChangeFn<string> = useCallback(
    value => setSearchInput(value as string),
    [],
  );

  const onRowClick = useCallback((order: Order) => setActiveOrder(order), []);
  const closeDetails = useCallback(() => setActiveOrder(null), []);
  const getRowId = useCallback((order: Order) => order.id, []);

  const baseColumns = useMemo(() => createOrderColumns(), []);

  const sortingFeature = useSortingFeature<Order>({
    manualSorting: true,
    sortingState: sorting,
    onSortingChange: setSorting,
  });
  const { columns, feature: columnFiltersFeature } = useColumnFiltersFeature({
    manualFiltering: true,
    columns: baseColumns,
    // filters: orderFilterFields,
    filters: {
      customer: {
        queryKey: "customer",
        type: "text",
        placeholder: "Поиск по клиенту…",
      },
      status: {
        queryKey: "statuses",
        type: "multiselect",
        options: STATUS_FILTER_OPTIONS,
      },
    },
    columnFilters,
    onColumnFiltersChange: setColumnFilters,
    defaultColumnFilters: {
      // statuses: ["pending"],
    },
  });
  const globalFilterFeature = useGlobalFilterFeature<Order>({
    manualFiltering: true,
    globalFilter: debouncedSearch,
    onGlobalFilterChange,
  });
  const selectionFeature = useRowSelectionFeature<Order>({
    selection: true,
    rowSelection,
    onRowSelectionChange: setRowSelection,
  });
  const paginationFeature = usePaginationFeature<Order>({
    manualPagination: true,
    pageSize: pagination.pageSize,
    pageCount,
    pageIndex: pagination.page - 1,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    onPaginationChange,
  });

  const features = useMemo(
    () => [
      sortingFeature,
      columnFiltersFeature,
      globalFilterFeature,
      selectionFeature,
      paginationFeature,
    ],
    [
      sortingFeature,
      columnFiltersFeature,
      globalFilterFeature,
      selectionFeature,
      paginationFeature,
    ],
  );

  return {
    orders,
    columns,
    isLoading,
    isRefreshing,
    isBusy,
    isError,
    error,
    features,
    reload: refresh,
    searchInput,
    search: debouncedSearch,
    onSearchInputChange,
    onClearSearch,
    activeOrder,
    onRowClick,
    closeDetails,
    getRowId,
  };
};
