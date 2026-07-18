import { useColumnOrderFeature } from "@components/ui";
import type { ColumnOrderState } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

const BASE_COLUMN_ORDER: ColumnOrderState = [
  "id",
  "customer",
  "status",
  "items",
  "amount",
  "createdAt",
];

export const useColumnOrderExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS.slice(0, 6), []);

  const [columnOrder, setColumnOrder] =
    useState<ColumnOrderState>(BASE_COLUMN_ORDER);

  const columnOrderFeature = useColumnOrderFeature<Order>({
    columnOrderState: columnOrder,
    onColumnOrderChange: setColumnOrder,
  });

  const features = useMemo(() => [columnOrderFeature], [columnOrderFeature]);

  const moveColumn = useCallback((id: string, direction: -1 | 1) => {
    setColumnOrder(order => {
      const index = order.indexOf(id);
      const nextIndex = index + direction;

      if (index === -1 || nextIndex < 0 || nextIndex >= order.length)
        return order;

      const next = [...order];

      [next[index], next[nextIndex]] = [next[nextIndex]!, next[index]!];

      return next;
    });
  }, []);

  return { data, columns, features, columnOrder, moveColumn };
};
