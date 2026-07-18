import { flexRender } from "@tanstack/react-table";
import { cn } from "@utils/cn";

import { type TanstackTable } from "../Table.types";
import { TableFooter, TableHead, TableRow } from "./TablePrimitive";

interface TableFooterSectionProps<TData> {
  table: TanstackTable<TData>;
  stickyFooter?: boolean;
  className?: string;
}

export const TableFooterSection = <TData,>({
  table,
  stickyFooter,
  className,
}: TableFooterSectionProps<TData>) => {
  return (
    <TableFooter
      className={cn(
        stickyFooter &&
          "sticky bottom-0 z-20 bg-card shadow-[0_-1px_0_0_hsl(var(--border))]",
        className,
      )}
    >
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
