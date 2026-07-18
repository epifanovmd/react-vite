import { useColumnFiltersFeature } from "@components/ui";
import { useMemo } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";
import { orderFilterFields, type OrderFilters } from "./order-filters";

export const useColumnFiltersExample = () => {
  const baseColumns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS, []);

  const { columns, feature } = useColumnFiltersFeature<Order, OrderFilters>({
    columns: baseColumns,
    filters: orderFilterFields,
  });

  const features = useMemo(() => [feature], [feature]);

  return { data, columns, features };
};
