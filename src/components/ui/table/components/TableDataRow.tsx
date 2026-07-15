import { flexRender, type Row } from "@tanstack/react-table";
import { MouseEvent } from "react";

import { cn } from "../../foundation";
import { TableCell, TableRow } from "./TablePrimitive";

interface TableDataRowProps<TData = unknown> {
  row: Row<TData>;
  isSelected: boolean;
  onRowClick?: (original: TData, e: MouseEvent<HTMLTableRowElement>) => void;
  onRowDoubleClick?: (
    original: TData,
    e: MouseEvent<HTMLTableRowElement>,
  ) => void;
  className?: string | ((row: TData) => string);
  resizable?: boolean;
}

const TableDataRowInner = <TData = unknown,>({
  row,
  isSelected,
  onRowClick,
  onRowDoubleClick,
  className,
  resizable,
}: TableDataRowProps<TData>) => {
  const resolvedClassName =
    typeof className === "function" ? className(row.original) : className;

  return (
    <TableRow
      selected={isSelected}
      onClick={onRowClick ? e => onRowClick(row.original, e) : undefined}
      onDoubleClick={
        onRowDoubleClick ? e => onRowDoubleClick(row.original, e) : undefined
      }
      className={cn(onRowClick && "cursor-pointer", resolvedClassName)}
    >
      {row.getVisibleCells().map(cell => {
        const colWidth = resizable
          ? cell.column.getSize()
          : cell.column.columnDef.size;

        return (
          <TableCell
            key={cell.id}
            style={
              colWidth != null
                ? { width: colWidth, minWidth: colWidth, maxWidth: colWidth }
                : undefined
            }
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export const TableDataRow = TableDataRowInner;
