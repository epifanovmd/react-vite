import { useExpandingFeature } from "@components/ui";
import { useMemo } from "react";

import {
  createOrderColumns,
  type Order,
  OrderDetails,
  ORDERS,
} from "../../shared";

export const useExpandingExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS.slice(0, 6), []);

  const expanding = useExpandingFeature<Order>({
    renderSubComponent: ({ row }) => <OrderDetails order={row.original} />,
  });

  const features = useMemo(() => [expanding], [expanding]);

  return { data, columns, features };
};
