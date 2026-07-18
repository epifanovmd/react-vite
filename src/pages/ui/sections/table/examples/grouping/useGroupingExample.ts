import { useGroupingFeature } from "@components/ui";
import { useMemo } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

export const useGroupingExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS, []);

  const grouping = useGroupingFeature<Order>({
    defaultGrouping: ["status"],
  });

  const features = useMemo(() => [grouping], [grouping]);

  return { data, columns, features };
};
