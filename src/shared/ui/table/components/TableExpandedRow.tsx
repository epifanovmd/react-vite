import type { Row } from "@tanstack/react-table";
import type { ReactNode } from "react";

import { TableCell, TableRow } from "./primitives";

interface TableExpandedRowProps<TData> {
  row: Row<TData>;
  colSpan: number;
  renderSubComponent: (props: { row: Row<TData> }) => ReactNode;
}

export const TableExpandedRow = <TData,>({
  row,
  colSpan,
  renderSubComponent,
}: TableExpandedRowProps<TData>) => (
  <TableRow className="hover:bg-transparent">
    <TableCell colSpan={colSpan} className="p-0">
      {renderSubComponent({ row })}
    </TableCell>
  </TableRow>
);
