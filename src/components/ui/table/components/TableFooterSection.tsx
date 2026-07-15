import { flexRender } from "@tanstack/react-table";

import { cn } from "../../foundation";
import { type TanstackTable } from "../Table.types";
import { TableFooter, TableHead, TableRow } from "./TablePrimitive";

interface TableFooterSectionProps<TData> {
  table: TanstackTable<TData>;
  className?: string;
}

export const TableFooterSection = <TData,>({
  table,
  className,
}: TableFooterSectionProps<TData>) => {
  return (
    <TableFooter className={cn(className)}>
      {table.getFooterGroups().map(footerGroup => (
        <TableRow key={footerGroup.id}>
          {footerGroup.headers.map(header => (
            <TableHead key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.footer,
                    header.getContext(),
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableFooter>
  );
};
