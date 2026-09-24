import { useRowSelectionFeature } from "@shared/ui";
import type { Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

const getRowId = (order: Order) => order.id;

export const useBulkActionsExample = () => {
  const [data, setData] = useState(() => ORDERS.slice(0, 12));

  const columns = useMemo(() => createOrderColumns(), []);

  const selection = useRowSelectionFeature<Order>({ mode: "multi" });
  const features = useMemo(() => [selection], [selection]);

  const markPaid = useCallback((rows: Row<Order>[]) => {
    const ids = new Set(rows.map(row => row.id));

    setData(prev =>
      prev.map(order =>
        ids.has(order.id) ? { ...order, status: "paid" as const } : order,
      ),
    );
  }, []);

  const remove = useCallback((rows: Row<Order>[]) => {
    const ids = new Set(rows.map(row => row.id));

    setData(prev => prev.filter(order => !ids.has(order.id)));
  }, []);

  const restore = useCallback(() => setData(ORDERS.slice(0, 12)), []);

  return { data, columns, features, getRowId, markPaid, remove, restore };
};
