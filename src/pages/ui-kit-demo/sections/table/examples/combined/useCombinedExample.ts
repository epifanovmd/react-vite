import {
  useColumnPinningFeature,
  useColumnSizingFeature,
  useGlobalFilterFeature,
  usePaginationFeature,
  useRowSelectionFeature,
  useSortingFeature,
} from "@shared/ui";
import { useMemo, useState } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

/**
 * Сводный пример: несколько фич вместе, как на реальном экране, а не по
 * отдельности, как в остальных примерах.
 */
export const useCombinedExample = () => {
  const [search, setSearch] = useState("");

  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS, []);

  const globalFilter = useGlobalFilterFeature<Order>({
    globalFilterState: search,
    onGlobalFilterChange: setSearch,
  });
  const sorting = useSortingFeature<Order>({
    defaultSorting: [{ id: "amount", desc: true }],
  });
  const selection = useRowSelectionFeature<Order>({ mode: "multi" });
  const sizing = useColumnSizingFeature<Order>();
  const pinning = useColumnPinningFeature<Order>({
    defaultColumnPinning: { left: ["id"] },
  });
  const pagination = usePaginationFeature<Order>({
    defaultPagination: { pageSize: 10 },
    pageSizeOptions: PAGE_SIZE_OPTIONS,
  });

  const features = useMemo(
    () => [globalFilter, sorting, selection, sizing, pinning, pagination],
    [globalFilter, sorting, selection, sizing, pinning, pagination],
  );

  return { data, columns, features, search, onSearchChange: setSearch };
};
