import { type Row } from "@tanstack/react-table";
import { cn } from "@utils/cn";
import { Fragment, MouseEvent, ReactNode, RefObject } from "react";

import { Empty } from "../../empty";
import { Spinner } from "../../spinner";
import { useInfiniteScrollSentinel } from "../hooks/useInfiniteScrollSentinel";
import { TableDataRow } from "./TableDataRow";
import { TableBody } from "./TablePrimitive";

interface TableBodySectionProps<TData> {
  rows: Row<TData>[];
  totalColumns: number;
  loading?: boolean;
  refreshing?: boolean;
  empty?: ReactNode;
  onRowClick?: (row: TData, e: MouseEvent<HTMLTableRowElement>) => void;
  onRowDoubleClick?: (row: TData, e: MouseEvent<HTMLTableRowElement>) => void;
  rowClassName?: string | ((row: TData) => string);
  renderSubComponent?: (props: { row: Row<TData> }) => ReactNode;
  className?: string;
  resizable?: boolean;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  infiniteScrollRootMargin?: string;
}

export const TableBodySection = <TData,>({
  rows,
  totalColumns,
  loading,
  refreshing,
  empty,
  onRowClick,
  onRowDoubleClick,
  rowClassName,
  renderSubComponent,
  className,
  resizable,
  scrollContainerRef,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore = () => {},
  infiniteScrollRootMargin,
}: TableBodySectionProps<TData>) => {
  const sentinelRef = useInfiniteScrollSentinel({
    containerRef: scrollContainerRef ?? { current: null },
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    rootMargin: infiniteScrollRootMargin,
  });

  if (loading) {
    return (
      <TableBody className={className}>
        <tr>
          <td colSpan={totalColumns} className="h-24">
            <div className="flex items-center justify-center">
              <Spinner size="md" variant="muted" />
            </div>
          </td>
        </tr>
      </TableBody>
    );
  }

  if (rows.length === 0) {
    return (
      <TableBody className={className}>
        <tr>
          <td colSpan={totalColumns}>
            {empty ?? <Empty size="sm" title="No data" icon="inbox" />}
          </td>
        </tr>
      </TableBody>
    );
  }

  return (
    <TableBody
      className={cn(
        refreshing
          ? "opacity-50 pointer-events-none transition-opacity duration-150"
          : "transition-opacity duration-150",
        className,
      )}
    >
      {rows.map(row => (
        <Fragment key={row.id}>
          <TableDataRow
            row={row}
            isSelected={row.getIsSelected()}
            onRowClick={onRowClick}
            onRowDoubleClick={onRowDoubleClick}
            className={rowClassName}
            resizable={resizable}
          />

          {row.getIsExpanded() && renderSubComponent && (
            <tr>
              <td colSpan={totalColumns} className="p-0">
                {renderSubComponent({ row })}
              </td>
            </tr>
          )}
        </Fragment>
      ))}

      {hasNextPage && (
        <tr ref={sentinelRef}>
          <td colSpan={totalColumns} className="h-10 p-0">
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-2">
                <Spinner size="sm" variant="muted" />
              </div>
            )}
          </td>
        </tr>
      )}
    </TableBody>
  );
};
