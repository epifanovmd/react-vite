import { useCallback, useMemo, useState } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

export const useRowClickExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS.slice(0, 10), []);

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const onRowClick = useCallback((order: Order) => setActiveOrder(order), []);
  const closeDetails = useCallback(() => setActiveOrder(null), []);

  return { data, columns, activeOrder, onRowClick, closeDetails };
};
