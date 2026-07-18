import { useColumnPinningFeature } from "@components/ui";
import { useMemo } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

export const useColumnPinningExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS.slice(0, 8), []);

  const pinning = useColumnPinningFeature<Order>({
    defaultColumnPinning: { left: ["id"], right: ["amount"] },
  });

  const features = useMemo(() => [pinning], [pinning]);

  return { data, columns, features };
};
