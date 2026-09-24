import { cn } from "@shared/lib/utils/cn";
import * as React from "react";

import {
  TableBodySection,
  TableColumnVisibility,
  TableContext,
  type TableContextValue,
  TableFooterSection,
  TableHeaderSection,
  TableRoot,
} from "./components";
import { TABLE_LABELS } from "./constants";
import { useTableInstance } from "./hooks";
import { TablePagination } from "./pagination";
import type { TableProps } from "./table.types";

export const Table = <TData,>(props: TableProps<TData>) => {
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
    toolbar,
    showColumnVisibility,
    labels: labelsOverride,
    caption,
    "aria-label": ariaLabel,
    loading,
    refreshing,
    error,
    empty,
    onRowClick,
    onRowDoubleClick,
    getRowProps,
    getRowId,
    tableOptions,
  } = props;

  const labels = React.useMemo(
    () => ({ ...TABLE_LABELS, ...labelsOverride }),
    [labelsOverride],
  );

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
    infiniteScroll,
  } = useTableInstance<TData>({
    data,
    columns,
    features,
    size,
    getRowId,
    tableOptions,
    labels,
  });

  const containerRef = React.useRef<HTMLDivElement>(null);

  const contextValue = React.useMemo<TableContextValue>(
    () => ({ size, variant, labels }),
    [size, variant, labels],
  );

  const hasToolbar = !!toolbar || !!showColumnVisibility;

  return (
    <TableContext.Provider value={contextValue}>
      <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
        {hasToolbar && (
          <div className="flex shrink-0 items-center justify-between gap-2 px-3 py-1.5">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {toolbar}
            </div>
            {showColumnVisibility && (
              <TableColumnVisibility
                table={table}
                pinningEnabled={pinningEnabled}
              />
            )}
          </div>
        )}

        <div
          ref={containerRef}
          className={cn(
            "flex-1 overflow-auto rounded-lg border",
            containerClassName,
          )}
        >
          <TableRoot className={tableClassName} aria-label={ariaLabel}>
            {caption && <caption className="sr-only">{caption}</caption>}
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
              columnSizing={table.getState().columnSizing}
              loading={loading}
              refreshing={refreshing}
              error={error}
              empty={empty}
              onRowClick={onRowClick}
              onRowDoubleClick={onRowDoubleClick}
              rowClassName={rowClassName}
              getRowProps={getRowProps}
              renderSubComponent={renderSubComponent}
              className={bodyClassName}
              resizable={resizingEnabled}
              scrollContainerRef={containerRef}
              infiniteScroll={infiniteScroll}
            />
            {hasFooter && (
              <TableFooterSection
                table={table}
                stickyFooter={stickyFooter}
                resizable={resizingEnabled}
                className={footerClassName}
              />
            )}
          </TableRoot>
        </div>

        {paginationEnabled && (
          <TablePagination table={table} pageSizeOptions={pageSizeOptions} />
        )}
      </div>
    </TableContext.Provider>
  );
};
