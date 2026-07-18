import { usePaginationFeature } from "@components/ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

const PAGE_SIZE = 10;
const LOAD_DELAY_MS = 800;

export const useInfiniteScrollExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);

  const [loadedCount, setLoadedCount] = useState(PAGE_SIZE);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const data = useMemo(() => ORDERS.slice(0, loadedCount), [loadedCount]);
  const hasNextPage = loadedCount < ORDERS.length;

  const onLoadMore = useCallback(() => {
    setIsFetchingNextPage(true);
    timeoutRef.current = setTimeout(() => {
      setLoadedCount(count => Math.min(count + PAGE_SIZE, ORDERS.length));
      setIsFetchingNextPage(false);
    }, LOAD_DELAY_MS);
  }, []);

  const pagination = usePaginationFeature<Order>({
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
  });

  const features = useMemo(() => [pagination], [pagination]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return { data, columns, features, loadedCount, total: ORDERS.length };
};
