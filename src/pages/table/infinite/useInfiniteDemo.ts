import { usePaginationFeature } from "@components/ui";
import { useInfinite } from "@store/holders";
import { useCallback, useEffect, useMemo, useState } from "react";

import { createOrderColumns } from "../table.columns";
import { fetchOrders } from "../table.mock";
import type { Order, OrderQuery } from "../table.types";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

export type InfiniteDemoViewModel = ReturnType<typeof useInfiniteDemo>;

export const useInfiniteDemo = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(searchInput.trim()),
      SEARCH_DEBOUNCE_MS,
    );

    return () => clearTimeout(timer);
  }, [searchInput]);

  const query = useMemo<OrderQuery>(
    () => ({ search: debouncedSearch }),
    [debouncedSearch],
  );

  const {
    items: orders,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasMore,
    isError,
    error,
    loadMore,
    refresh,
  } = useInfinite<Order, OrderQuery>({
    queryFn: fetchOrders,
    pageSize: PAGE_SIZE,
    keyExtractor: order => order.id,
    watch: [query],
  });

  const columns = useMemo(
    () => createOrderColumns({ enableSorting: false }),
    [],
  );
  const getRowId = useCallback((order: Order) => order.id, []);

  const pagination = usePaginationFeature<Order>({
    hasNextPage: hasMore,
    isFetchingNextPage: isLoadingMore,
    onLoadMore: loadMore,
  });

  const features = useMemo(() => [pagination], [pagination]);

  const onSearchInputChange = useCallback(
    (value: string) => setSearchInput(value),
    [],
  );
  const onClearSearch = useCallback(() => setSearchInput(""), []);
  const reload = useCallback(() => refresh(query), [refresh, query]);

  return {
    orders,
    columns,
    isLoading,
    isRefreshing,
    isError,
    error,
    features,
    searchInput,
    search: debouncedSearch,
    onSearchInputChange,
    onClearSearch,
    getRowId,
    reload,
  };
};
