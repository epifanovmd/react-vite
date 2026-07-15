export const hasFacetedFilter = (columns: any[]): boolean =>
  columns.some((col: any) => (col.meta?.filter as any)?.faceted);
