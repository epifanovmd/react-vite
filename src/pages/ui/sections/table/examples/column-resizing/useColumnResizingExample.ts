import { useColumnSizingFeature } from "@components/ui";
import { useMemo } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

export const useColumnResizingExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS.slice(0, 6), []);

  const sizing = useColumnSizingFeature<Order>();

  const features = useMemo(() => [sizing], [sizing]);

  return { data, columns, features };
};
