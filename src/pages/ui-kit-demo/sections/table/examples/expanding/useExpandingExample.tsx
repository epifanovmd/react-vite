import type { ExpandingFeatureOptions } from "@shared/ui";
import { useExpandingFeature } from "@shared/ui";
import { useMemo } from "react";

import {
  createOrderColumns,
  type Order,
  OrderDetails,
  ORDERS,
} from "../../shared";

const renderSubComponent: ExpandingFeatureOptions<Order>["renderSubComponent"] =
  ({ row }) => <OrderDetails order={row.original} />;

export const useExpandingExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS.slice(0, 6), []);

  const expanding = useExpandingFeature<Order>({ renderSubComponent });

  const features = useMemo(() => [expanding], [expanding]);

  return { data, columns, features };
};
