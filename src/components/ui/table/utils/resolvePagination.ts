import type { PaginationOptions } from "../Table.types";

export interface PagConfig {
  enabled: boolean;
  manual: boolean;
  pageSize: number;
  pageIndex: number;
  pageCount?: number;
}

export const resolvePagination = (pagination: boolean | PaginationOptions | undefined): PagConfig => {
  if (!pagination) return { enabled: false, manual: false, pageSize: 10, pageIndex: 0 };
  if (pagination === true) return { enabled: true, manual: false, pageSize: 10, pageIndex: 0 };

  return {
    enabled: true,
    manual: "pageCount" in pagination && pagination.pageCount != null,
    pageSize: pagination.pageSize ?? 10,
    pageIndex: pagination.pageIndex ?? 0,
    pageCount: pagination.pageCount,
  };
};
