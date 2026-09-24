import type { TableSize, TableVariant } from "@shared/ui";
import { useMemo, useState } from "react";

import { createOrderColumns, ORDERS } from "../../shared";

export type DisplayState = "data" | "loading" | "empty" | "error";

export const useDisplayOptionsExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);

  const [variant, setVariant] = useState<TableVariant>("default");
  const [size, setSize] = useState<TableSize>("md");
  const [display, setDisplay] = useState<DisplayState>("data");

  const data = useMemo(
    () => (display === "data" ? ORDERS.slice(0, 6) : []),
    [display],
  );

  return {
    data,
    columns,
    variant,
    setVariant,
    size,
    setSize,
    display,
    setDisplay,
    loading: display === "loading",
    error: display === "error",
  };
};
