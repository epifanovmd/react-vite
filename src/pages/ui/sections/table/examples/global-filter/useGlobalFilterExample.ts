import { useGlobalFilterFeature } from "@components/ui";
import { useCallback, useMemo, useState } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

export const useGlobalFilterExample = () => {
  const [search, setSearch] = useState("");

  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS.slice(0, 12), []);

  const globalFilter = useGlobalFilterFeature<Order>({
    globalFilter: search,
    onGlobalFilterChange: setSearch,
  });

  const features = useMemo(() => [globalFilter], [globalFilter]);

  const onSearchChange = useCallback((value: string) => setSearch(value), []);

  return { data, columns, features, search, onSearchChange };
};
