import { flexRender, type Row } from "@tanstack/react-table";
import { memo, MouseEvent, useCallback } from "react";

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

  const handleClick = useCallback(
    (e: MouseEvent<HTMLTableRowElement>) => onRowClick?.(row.original, e),
    [onRowClick, row.original],
  );

  const handleDoubleClick = useCallback(
    (e: MouseEvent<HTMLTableRowElement>) => onRowDoubleClick?.(row.original, e),
    [onRowDoubleClick, row.original],
  );

  return (
    <TableRow
      selected={isSelected}
      onClick={onRowClick ? handleClick : undefined}
      onDoubleClick={onRowDoubleClick ? handleDoubleClick : undefined}
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

export const TableDataRow = memo(TableDataRowInner) as typeof TableDataRowInner;
