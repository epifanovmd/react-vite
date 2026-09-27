import { useMemo } from "react";

import { createOrderColumns, ORDERS } from "../../shared";

export const useStickyExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS, []);

  return { data, columns };
};
