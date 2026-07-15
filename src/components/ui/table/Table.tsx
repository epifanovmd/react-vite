import { PropsWithChildren } from "react";

import { createSlot, useSlotProps } from "../../slots";
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
import type { TablePaginationProps } from "./pagination";
import { TablePagination } from "./pagination";
import type { TableProps } from "./Table.types";

const PaginationSlot = createSlot<TablePaginationProps>("Pagination");
const ColumnVisibilitySlot = createSlot<{}>("ColumnVisibility");

const TableComponent = <TData,>(
  props: PropsWithChildren<TableProps<TData>>,
) => {
  const {
    variant = "default",
    size = "md",
    stickyHeader,
    className,
    containerClassName,
    tableClassName,
    headerClassName,
    bodyClassName,
    footerClassName,
    rowClassName,
    sorting,
    loading,
    refreshing,
    empty,
    onRowClick,
    onRowDoubleClick,
    renderSubComponent,
    resizable,
    pagination,
    children,
  } = props;

  const { table, rows, totalColumns, hasFooter } =
    useTableInstance<TData>(props);
  const { pagination: paginationSlot, columnVisibility } = useSlotProps(
    Table,
    children,
  );

  const isPaginationEnabled = !!pagination;

  return (
    <TableContext.Provider value={{ size, variant }}>
      {columnVisibility && (
        <div className="flex items-center justify-end px-3 py-1.5">
          <TableColumnVisibility table={table} />
        </div>
      )}

      <div
        className={cn(
          "flex-1 overflow-auto rounded-lg border",
          containerClassName,
        )}
      >
        <TableRoot className={cn(tableClassName ?? className)}>
          <TableHeaderSection
            table={table}
            sorting={sorting}
            stickyHeader={stickyHeader}
            resizable={resizable}
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
            resizable={resizable}
          />
          {hasFooter && (
            <TableFooterSection table={table} className={footerClassName} />
          )}
        </TableRoot>
      </div>

      {paginationSlot && (
        <TablePagination
          table={isPaginationEnabled ? table : undefined}
          {...paginationSlot}
        />
      )}
    </TableContext.Provider>
  );
};

TableComponent.displayName = "Table";

export const Table = Object.assign(TableComponent, {
  Pagination: PaginationSlot,
  ColumnVisibility: ColumnVisibilitySlot,
});
