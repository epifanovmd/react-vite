import { useSortingFeature } from "@components/ui";
import { useMemo } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

export const useSortingExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS.slice(0, 8), []);

  const sorting = useSortingFeature<Order>({
    defaultSorting: [{ id: "amount", desc: true }],
  });

  const features = useMemo(() => [sorting], [sorting]);

  return { data, columns, features };
};
