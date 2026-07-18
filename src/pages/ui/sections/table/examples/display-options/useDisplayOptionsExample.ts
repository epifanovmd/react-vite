import type { TableProps } from "@components/ui";
import { useMemo, useState } from "react";

import { createOrderColumns, ORDERS } from "../../shared";

type Variant = NonNullable<TableProps<unknown>["variant"]>;
type Size = NonNullable<TableProps<unknown>["size"]>;
type DisplayState = "data" | "loading" | "empty";

export const useDisplayOptionsExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);

  const [variant, setVariant] = useState<Variant>("default");
  const [size, setSize] = useState<Size>("md");
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
  };
};
