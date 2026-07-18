import { cn } from "@utils/cn";

import { type TanstackTable } from "../Table.types";
import { TableHeadCell } from "./TableHeadCell";
import { TableHeader, TableRow } from "./TablePrimitive";

interface TableHeaderSectionProps<TData> {
  table: TanstackTable<TData>;
  sorting?: boolean;
  filtering?: boolean;
  grouping?: boolean;
  stickyHeader?: boolean;
  resizable?: boolean;
  className?: string;
}

export const TableHeaderSection = <TData,>({
  table,
  sorting,
  filtering,
  grouping,
  stickyHeader,
  resizable,
  className,
}: TableHeaderSectionProps<TData>) => {
  return (
    <TableHeader
      className={cn(
        stickyHeader &&
          "sticky top-0 z-20 bg-card shadow-[0_1px_0_0_hsl(var(--border))]",
        className,
      )}
    >
      {table.getHeaderGroups().map(headerGroup => (
        <TableRow key={headerGroup.id} className="hover:bg-transparent">
          {headerGroup.headers.map(header => (
            <TableHeadCell
              key={header.id}
              header={header}
              sorting={sorting}
              filtering={filtering}
              grouping={grouping}
              resizable={resizable}
            />
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
};
