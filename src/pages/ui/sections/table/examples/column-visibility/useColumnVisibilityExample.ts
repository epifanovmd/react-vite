import { useColumnVisibilityFeature } from "@components/ui";
import { useMemo } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

export const useColumnVisibilityExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS.slice(0, 8), []);

  const visibility = useColumnVisibilityFeature<Order>({
    defaultColumnVisibility: { items: false },
  });

  const features = useMemo(() => [visibility], [visibility]);

  return { data, columns, features };
};
