import { useMemo } from "react";

import { createOrderColumns, ORDERS } from "../../shared";

export const useBasicExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS.slice(0, 6), []);

  return { data, columns };
};
