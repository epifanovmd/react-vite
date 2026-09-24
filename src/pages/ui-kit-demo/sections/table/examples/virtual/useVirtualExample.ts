import { useSortingFeature } from "@shared/ui";
import { useMemo } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

const ROW_COUNT = 10_000;

/** 10 000 строк из общего набора: id уникальны, остальное повторяется. */
const buildRows = (): Order[] =>
  Array.from({ length: ROW_COUNT }, (_, index) => ({
    ...ORDERS[index % ORDERS.length]!,
    id: `ORD-${String(index + 1).padStart(5, "0")}`,
  }));

export const useVirtualExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(buildRows, []);

  const sorting = useSortingFeature<Order>();
  const features = useMemo(() => [sorting], [sorting]);

  return { data, columns, features };
};
