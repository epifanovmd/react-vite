import type { Column } from "@tanstack/react-table";
import { useMemo } from "react";

import { Select } from "../../../../select";

interface FacetedFilterControlProps<TData> {
  column: Column<TData, unknown>;
}

export const FacetedFilterControl = <TData,>({
  column,
}: FacetedFilterControlProps<TData>) => {
  const uniqueValues = column.getFacetedUniqueValues();
  const currentValue = column.getFilterValue() as string | null | undefined;

  const options = useMemo(() => {
    return Array.from(uniqueValues.entries())
      .filter(([, count]) => count > 0)
      .map(([value]) => ({ value: String(value), label: String(value) }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [uniqueValues]);

  return (
    <Select
      clearable
      size="sm"
      search
      placeholder="Все"
      options={options}
      value={currentValue ?? null}
      onChange={(v: string | null) => column.setFilterValue(v)}
    />
  );
};
