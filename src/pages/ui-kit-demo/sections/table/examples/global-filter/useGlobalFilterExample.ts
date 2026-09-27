import { useGlobalFilterFeature } from "@shared/ui";
import { useMemo, useState } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

export const useGlobalFilterExample = () => {
  const [search, setSearch] = useState("");

  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS.slice(0, 12), []);

  const globalFilter = useGlobalFilterFeature<Order>({
    globalFilterState: search,
    onGlobalFilterChange: setSearch,
  });

  const features = useMemo(() => [globalFilter], [globalFilter]);

  return { data, columns, features, search, onSearchChange: setSearch };
};
