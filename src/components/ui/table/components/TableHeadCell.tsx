import { flexRender, type Header } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Group, Ungroup } from "lucide-react";

import { cn } from "../../foundation";
import { getPinningStyle } from "../utils";
import { TableHeadFilter } from "./TableHeadFilter";
import { TableHead } from "./TablePrimitive";

const SortIcon = ({ direction }: { direction: "asc" | "desc" | false }) => {
  if (direction === "asc") return <ArrowUp className="h-3.5 w-3.5 shrink-0" />;
  if (direction === "desc")
    return <ArrowDown className="h-3.5 w-3.5 shrink-0" />;

  return <ArrowUpDown className="h-3.5 w-3.5 shrink-0 opacity-40" />;
};

interface TableHeadCellProps<TData = unknown> {
  header: Header<TData, unknown>;
  sorting?: boolean;
  filtering?: boolean;
  grouping?: boolean;
  resizable?: boolean;
}

export const TableHeadCell = <TData = unknown,>({
  header,
  sorting,
  filtering,
  grouping,
  resizable,
}: TableHeadCellProps<TData>) => {
  if (header.isPlaceholder) {
    return <TableHead colSpan={header.colSpan} />;
  }

  const content = flexRender(
    header.column.columnDef.header,
    header.getContext(),
  );
  const canSort = sorting && header.column.getCanSort();
  const canGroup = grouping && header.column.getCanGroup();
  const canFilter = filtering && !!header.column.columnDef.meta?.filter;
  const { style: pinStyle, className: pinClassName } = getPinningStyle(
    header.column,
  );

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

  const colWidth = resizable ? header.getSize() : header.column.columnDef.size;
  const widthStyle =
    colWidth != null
      ? { width: colWidth, minWidth: colWidth, maxWidth: colWidth }
      : undefined;

  return (
    <TableHead
      colSpan={header.colSpan}
      className={pinClassName}
      style={{ ...widthStyle, ...pinStyle, position: "relative" }}
    >
      <div className="flex items-center gap-1">
        {canFilter ? (
          <>
            {inner}
            <TableHeadFilter column={header.column} />
          </>
        ) : (
          inner
        )}

        {canGroup && (
          <button
            type="button"
            aria-label={
              header.column.getIsGrouped()
                ? "Разгруппировать по колонке"
                : "Группировать по колонке"
            }
            className={cn(
              "inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              header.column.getIsGrouped() && "text-primary",
            )}
            onClick={e => {
              e.stopPropagation();
              header.column.getToggleGroupingHandler()();
            }}
          >
            {header.column.getIsGrouped() ? (
              <Ungroup className="h-3.5 w-3.5" />
            ) : (
              <Group className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {resizable && header.column.getCanResize() && (
        <div
          className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-primary/50 active:bg-primary transition-colors"
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          onClick={e => e.stopPropagation()}
        />
      )}
    </TableHead>
  );
};
