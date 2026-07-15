import * as React from "react";
import { PropsWithChildren } from "react";

import { createSlot, useSlotProps } from "../../slots";
import { cn } from "../foundation";
import { TableBodySection } from "./components/TableBodySection";
import { TableContext } from "./components/TableContext";
import { TableFooterSection } from "./components/TableFooterSection";
import { TableHeaderSection } from "./components/TableHeaderSection";
import { TableRoot } from "./components/TablePrimitive";
import { useTableInstance } from "./hooks/useTableInstance";
import type { TablePaginationProps } from "./pagination/TablePagination";
import { TablePagination } from "./pagination/TablePagination";
import type { TableProps } from "./Table.types";

const PaginationSlot = createSlot<TablePaginationProps>("Pagination");

/* eslint-disable react-refresh/only-export-components */
const TableComponent = <TData,>(
  props: PropsWithChildren<TableProps<TData>>,
) => {
  const {
    variant = "default",
    size = "md",
    stickyHeader,
    className,
    containerClassName,
    sorting,
    loading,
    refreshing,
    empty,
    onRowClick,
    children,
  } = props;

  const { table, rows, totalColumns, hasFooter } =
    useTableInstance<TData>(props);
  const { pagination } = useSlotProps(Table, children);

  return (
    <TableContext.Provider value={{ size, variant }}>
      <div
        className={cn(
          "flex-1 overflow-auto rounded-lg border",
          containerClassName,
        )}
      >
        <TableRoot className={cn("h-full", className)}>
          <TableHeaderSection
            table={table}
            sorting={sorting}
            stickyHeader={stickyHeader}
          />
          <TableBodySection
            rows={rows}
            totalColumns={totalColumns}
            loading={loading}
            refreshing={refreshing}
            empty={empty}
            onRowClick={onRowClick}
          />
          {hasFooter && <TableFooterSection table={table} />}
        </TableRoot>
      </div>
      {pagination && <TablePagination {...pagination} />}
    </TableContext.Provider>
  );
};

TableComponent.displayName = "Table";

export const Table = Object.assign(TableComponent, {
  Pagination: PaginationSlot,
});
