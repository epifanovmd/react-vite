import { useRowSelectionFeature } from "@components/ui";
import type { RowSelectionState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

export const useRowSelectionExample = () => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS.slice(0, 10), []);

  const selection = useRowSelectionFeature<Order>({
    selection: "multi",
    rowSelection,
    onRowSelectionChange: setRowSelection,
  });

  const features = useMemo(() => [selection], [selection]);

  const selectedCount = useMemo(
    () => Object.values(rowSelection).filter(Boolean).length,
    [rowSelection],
  );

  return { data, columns, features, selectedCount };
};
