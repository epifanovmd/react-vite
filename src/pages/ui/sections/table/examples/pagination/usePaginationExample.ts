import { usePaginationFeature } from "@components/ui";
import { useMemo } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export const usePaginationExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS, []);

  const pagination = usePaginationFeature<Order>({
    pageSize: 10,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
  });

  const features = useMemo(() => [pagination], [pagination]);

  return { data, columns, features };
};
