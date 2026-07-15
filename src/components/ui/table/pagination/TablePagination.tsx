import { useCallback, useMemo } from "react";

import { Pagination } from "../../pagination";
import { Select } from "../../select";

interface TableLike {
  getPageCount(): number;
  setPageIndex(index: number): void;
  setPageSize(size: number): void;
  getState(): { pagination: { pageIndex: number; pageSize: number } };
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export interface TablePaginationProps {
  table?: TableLike;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const TablePagination = ({
  table,
  totalPages: manualTotalPages,
  currentPage: manualCurrentPage = 1,
  pageSize: manualPageSize,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageChange: manualOnPageChange,
  onPageSizeChange: manualOnPageSizeChange,
}: TablePaginationProps) => {
  const autoWired = !!table;

  const totalPages = autoWired ? table.getPageCount() : (manualTotalPages ?? 1);
  const pageIndex = autoWired
    ? table.getState().pagination.pageIndex
    : manualCurrentPage - 1;
  const pageSize = autoWired
    ? table.getState().pagination.pageSize
    : (manualPageSize ?? pageSizeOptions[0] ?? 10);

  const onPageChange = useCallback(
    (page: number) => {
      if (autoWired) {
        table.setPageIndex(page - 1);
      } else {
        manualOnPageChange?.(page);
      }
    },
    [autoWired, table, manualOnPageChange],
  );

  const onPageSizeChange = useCallback(
    (size: number) => {
      if (autoWired) {
        table.setPageSize(size);
      } else {
        manualOnPageSizeChange?.(size);
      }
    },
    [autoWired, table, manualOnPageSizeChange],
  );

  const showSizeSelector = !!onPageSizeChange && pageSize !== undefined;

  const options = useMemo(
    () =>
      pageSizeOptions.map(n => ({ value: String(n), label: `${n} / стр.` })),
    [pageSizeOptions],
  );

  return (
    <div className="flex items-center justify-between p-4">
      <p className="text-xs text-muted-foreground">
        {`Страница ${pageIndex + 1} из ${totalPages}`}
      </p>

      <div className="flex items-center gap-3">
        <Pagination
          currentPage={pageIndex + 1}
          totalPages={totalPages}
          onPageChange={onPageChange}
          size="sm"
        />
        {showSizeSelector && (
          <Select
            options={options}
            value={String(pageSize)}
            onChange={(v: string) => onPageSizeChange(Number(v))}
            size="sm"
            dropdownWidth={"auto"}
          />
        )}
      </div>
    </div>
  );
};
