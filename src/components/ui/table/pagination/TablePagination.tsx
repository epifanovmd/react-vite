import { RowData, Table } from "@tanstack/react-table";
import { useMemo } from "react";

import { Pagination } from "../../pagination";
import { Select } from "../../select";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export interface TablePaginationProps<TData extends RowData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export const TablePagination = <TData extends RowData>({
  table,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: TablePaginationProps<TData>) => {
  const totalPages = table.getPageCount();
  const { pagination } = table.getState();

  const options = useMemo(
    () =>
      pageSizeOptions.map(n => ({ value: String(n), label: `${n} / стр.` })),
    [pageSizeOptions],
  );

  return (
    <div className="flex items-center justify-between p-4">
      <p className="text-xs text-muted-foreground">
        {`Страница ${pagination.pageIndex + 1} из ${totalPages}`}
      </p>

      <div className="flex items-center gap-3">
        <Pagination
          currentPage={pagination.pageIndex + 1}
          totalPages={totalPages}
          onPageChange={page => table.setPageIndex(page - 1)}
          size="sm"
        />
        <Select
          options={options}
          value={String(pagination.pageSize)}
          onChange={(v: string) => table.setPageSize(Number(v))}
          size="sm"
          dropdownWidth={"auto"}
        />
      </div>
    </div>
  );
};
