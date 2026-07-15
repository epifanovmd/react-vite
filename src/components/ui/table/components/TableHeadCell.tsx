import { flexRender, type Header } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { TableHeadFilter } from "./TableHeadFilter";
import { TableHead } from "./TablePrimitive";

interface SortIconProps {
  direction: "asc" | "desc" | false;
}

const SortIcon = ({ direction }: SortIconProps) => {
  if (direction === "asc") return <ArrowUp className="h-3.5 w-3.5 shrink-0" />;
  if (direction === "desc")
    return <ArrowDown className="h-3.5 w-3.5 shrink-0" />;

  return <ArrowUpDown className="h-3.5 w-3.5 shrink-0 opacity-40" />;
};

interface TableHeadCellProps<TData = unknown> {
  header: Header<TData, unknown>;
  sorting?: boolean;
}

export const TableHeadCell = <TData = unknown,>({
  header,
  sorting,
}: TableHeadCellProps<TData>) => {
  if (header.isPlaceholder) {
    return <TableHead colSpan={header.colSpan} />;
  }

  const content = flexRender(
    header.column.columnDef.header,
    header.getContext(),
  );
  const canSort = sorting && header.column.getCanSort();

  // Колонка фильтруется, только если задан meta.filter — не опираемся на
  // column.getCanFilter() (TanStack по умолчанию разрешает фильтр всем колонкам).
  const canFilter = !!header.column.columnDef.meta?.filter;

  const inner = canSort ? (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
      onClick={header.column.getToggleSortingHandler()}
    >
      {content}
      <SortIcon direction={header.column.getIsSorted()} />
    </button>
  ) : (
    content
  );

  // Триггер фильтра — сиблинг sort-кнопки (вложенные <button> невалидны).
  const colWidth = header.column.columnDef.size;

  return (
    <TableHead
      colSpan={header.colSpan}
      style={colWidth != null ? { width: colWidth, minWidth: colWidth, maxWidth: colWidth } : undefined}
    >
      {canFilter ? (
        <div className="flex items-center gap-1">
          {inner}

          <TableHeadFilter column={header.column} />
        </div>
      ) : (
        inner
      )}
    </TableHead>
  );
};
