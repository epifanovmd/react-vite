import {
  useColumnPinningFeature,
  useColumnSizingFeature,
  useGlobalFilterFeature,
  usePaginationFeature,
  useRowSelectionFeature,
  useSortingFeature,
} from "@components/ui";
import { useCallback, useMemo, useState } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

/**
 * Kitchen-sink example: shows several features composed together, the way a
 * real screen would combine them, rather than in isolation like the other
 * examples.
 */
export const useCombinedExample = () => {
  const [search, setSearch] = useState("");

  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS, []);

  const globalFilter = useGlobalFilterFeature<Order>({
    globalFilter: search,
    onGlobalFilterChange: setSearch,
  });
  const sorting = useSortingFeature<Order>({
    defaultSorting: [{ id: "amount", desc: true }],
  });
  const selection = useRowSelectionFeature<Order>({ selection: "multi" });
  const sizing = useColumnSizingFeature<Order>();
  const pinning = useColumnPinningFeature<Order>({
    defaultColumnPinning: { left: ["id"] },
  });
  const pagination = usePaginationFeature<Order>({
    pageSize: 10,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
  });

  const features = useMemo(
    () => [globalFilter, sorting, selection, sizing, pinning, pagination],
    [globalFilter, sorting, selection, sizing, pinning, pagination],
  );

  const onSearchChange = useCallback((value: string) => setSearch(value), []);

  return { data, columns, features, search, onSearchChange };
};
