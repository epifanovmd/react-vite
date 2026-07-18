import {
  useColumnFiltersFeature,
  useColumnSizingFeature,
  usePaginationFeature,
  useRowSelectionFeature,
  useSortingFeature,
} from "@components/ui";
import { useCallback, useMemo, useState } from "react";

import {
  clientOrderFilterFields,
  type ClientOrderFilters,
  createOrderColumns,
} from "../table.columns";
import { getClientOrders } from "../table.mock";
import type { Order } from "../table.types";

const PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50];

export interface UseClientDemoOptions {
  resizable: boolean;
}

export type ClientDemoViewModel = ReturnType<typeof useClientDemo>;

export const useClientDemo = ({ resizable }: UseClientDemoOptions) => {
  const [search, setSearch] = useState("");
  const onSearchChange = useCallback((value: string) => setSearch(value), []);

  const orders = useMemo(() => getClientOrders(search), [search]);
  const baseColumns = useMemo(() => createOrderColumns(), []);

  const getRowId = useCallback((order: Order) => order.id, []);

  const sorting = useSortingFeature<Order>({
    defaultSorting: [{ id: "amount", desc: true }],
  });
  const selection = useRowSelectionFeature<Order>({ selection: "multi" });
  const { columns, feature: columnFilters } = useColumnFiltersFeature<
    Order,
    ClientOrderFilters
  >({
    columns: baseColumns,
    filters: clientOrderFilterFields,
  });
  const sizing = useColumnSizingFeature<Order>({ enabled: resizable });
  const pagination = usePaginationFeature<Order>({
    pageSize: PAGE_SIZE,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
  });

  const features = useMemo(
    () => [sorting, selection, columnFilters, sizing, pagination],
    [sorting, selection, columnFilters, sizing, pagination],
  );

  return {
    orders,
    columns,
    search,
    onSearchChange,
    getRowId,
    features,
  };
};
