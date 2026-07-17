import {
  useColumnFiltersFeature,
  useColumnSizingFeature,
  usePaginationFeature,
  useRowSelectionFeature,
  useSortingFeature,
} from "@components/ui";
import { useCallback, useMemo, useState } from "react";

import { getClientOrders } from "../table.mock";
import type { Order } from "../table.types";
import {
  clientOrderFilterFields,
  type ClientOrderFilters,
  createClientOrderColumns,
} from "../tableColumns";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export interface UseClientDemoOptions {
  resizable: boolean;
}

export type ClientDemoViewModel = ReturnType<typeof useClientDemo>;

export const useClientDemo = ({ resizable }: UseClientDemoOptions) => {
  const [search, setSearch] = useState("");
  const onSearchChange = useCallback((value: string) => setSearch(value), []);

  const orders = useMemo(() => getClientOrders(search), [search]);
  const baseColumns = useMemo(() => createClientOrderColumns(), []);

  const getRowId = useCallback((order: Order) => order.id, []);
  const rowClassName = useCallback(
    (order: Order) =>
      order.status === "failed"
        ? "bg-destructive/5 [&_td]:border-destructive/20"
        : order.status === "paid"
          ? "bg-success/5"
          : "",
    [],
  );

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
    pageSize: 10,
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
    rowClassName,
    features,
  };
};
