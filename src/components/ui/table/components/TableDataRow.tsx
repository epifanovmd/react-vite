import {
  flexRender,
  type Row,
  type VisibilityState,
} from "@tanstack/react-table";
import { cn } from "@utils/cn";
import { memo, MouseEvent, useCallback } from "react";

import { getPinningStyle } from "../utils";
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
  columnVisibility?: VisibilityState;
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
        const { style: pinStyle, className: pinClassName } = getPinningStyle(
          cell.column,
        );

        return (
          <TableCell
            key={cell.id}
            className={pinClassName}
            style={{
              ...(colWidth != null
                ? { width: colWidth, minWidth: colWidth, maxWidth: colWidth }
                : undefined),
              ...pinStyle,
            }}
          >
            {cell.getIsPlaceholder() ? null : cell.getIsGrouped() ? (
              <span className="inline-flex items-center gap-1.5">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                <span className="text-xs text-muted-foreground">
                  ({row.subRows.length})
                </span>
              </span>
            ) : cell.getIsAggregated() ? (
              flexRender(
                cell.column.columnDef.aggregatedCell ??
                  cell.column.columnDef.cell,
                cell.getContext(),
              )
            ) : (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export const TableDataRow = memo(TableDataRowInner) as typeof TableDataRowInner;
