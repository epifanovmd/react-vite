import { useRef } from "react";

import { cn } from "../foundation";
import {
  TableBodySection,
  TableColumnVisibility,
  TableContext,
  TableFooterSection,
  TableHeaderSection,
  TableRoot,
} from "./components";
import { useTableInstance } from "./hooks";
import { TablePagination } from "./pagination";
import type { TableProps } from "./Table.types";

const TableComponent = <TData,>(props: TableProps<TData>) => {
  const {
    data,
    columns,
    features,
    variant = "default",
    size = "md",
    stickyHeader,
    stickyFooter,
    className,
    containerClassName,
    tableClassName,
    headerClassName,
    bodyClassName,
    footerClassName,
    rowClassName,
    showColumnVisibility,
    loading,
    refreshing,
    empty,
    onRowClick,
    onRowDoubleClick,
    getRowId,
    tableOptions,
  } = props;

  const {
    table,
    rows,
    totalColumns,
    hasFooter,
    sortingEnabled,
    filteringEnabled,
    paginationEnabled,
    resizingEnabled,
    pinningEnabled,
    groupingEnabled,
    renderSubComponent,
    pageSizeOptions,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    infiniteScrollRootMargin,
  } = useTableInstance<TData>({
    data,
    columns,
    features,
    size,
    getRowId,
    tableOptions,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <TableContext.Provider value={{ size, variant }}>
      {showColumnVisibility && (
        <div className="flex items-center justify-end px-3 py-1.5">
          <TableColumnVisibility table={table} pinningEnabled={pinningEnabled} />
        </div>
      )}

      <div
        ref={containerRef}
        className={cn(
          "flex-1 overflow-auto rounded-lg border",
          containerClassName,
        )}
      >
        <TableRoot className={cn(tableClassName ?? className)}>
          <TableHeaderSection
            table={table}
            sorting={sortingEnabled}
            filtering={filteringEnabled}
            grouping={groupingEnabled}
            stickyHeader={stickyHeader}
            resizable={resizingEnabled}
            className={headerClassName}
          />
          <TableBodySection
            rows={rows}
            totalColumns={totalColumns}
            loading={loading}
            refreshing={refreshing}
            empty={empty}
            onRowClick={onRowClick}
            onRowDoubleClick={onRowDoubleClick}
            rowClassName={rowClassName}
            renderSubComponent={renderSubComponent}
            className={bodyClassName}
            resizable={resizingEnabled}
            scrollContainerRef={containerRef}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={onLoadMore}
            infiniteScrollRootMargin={infiniteScrollRootMargin}
          />
          {hasFooter && (
            <TableFooterSection
              table={table}
              stickyFooter={stickyFooter}
              className={footerClassName}
            />
          )}
        </TableRoot>
      </div>

      {paginationEnabled && (
        <TablePagination table={table} pageSizeOptions={pageSizeOptions} />
      )}
    </TableContext.Provider>
  );
};

TableComponent.displayName = "Table";

export const Table = TableComponent;
