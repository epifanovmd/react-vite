import type { LabeledValue } from "../../../../select";
import { Select } from "../../../../select";
import { useAsyncOptions, useStaticOptions } from "../../../../select/strategies";
import type { ColumnFilterOption } from "./ColumnFilterOption";
import type { FilterControlProps } from "./FilterControlProps";

export interface SelectFilterConfig<T = string> {
  type: "select";
  options?: ColumnFilterOption<T>[];
  fetchOptions?: (query: string) => Promise<ColumnFilterOption<T>[]>;
  placeholder?: string;
  queryKey?: string;
  labelInValue?: boolean;
}

export const SelectFilterControl = <TData,>({
  config,
  column,
}: FilterControlProps<SelectFilterConfig, TData>) => {
  const { options, fetchOptions, placeholder, labelInValue } = config;

  const searchable = useStaticOptions(options ?? [], { search: !fetchOptions });
  const asyncSearchable = useAsyncOptions({
    fetch: async query => {
      if (fetchOptions) {
        return await fetchOptions(query);
      }

      return [];
    },
    getOption: item => item,
    debounce: 300,
    minQueryLength: 2,
    fetchOnMount: true,
  });

  const props = fetchOptions ? asyncSearchable : searchable;

  if (labelInValue) {
    return (
      <Select<string>
        {...props}
        clearable
        labelInValue
        size="sm"
        placeholder={placeholder ?? "Все"}
        value={
          (column.getFilterValue() as LabeledValue | null | undefined) ?? null
        }
        onChange={(v: LabeledValue | null) => column.setFilterValue(v)}
      />
    );
  }

  return (
    <Select
      {...props}
      clearable
      size="sm"
      placeholder={placeholder ?? "Все"}
      value={(column.getFilterValue() as string | null | undefined) ?? null}
      onChange={(v: string | null) => column.setFilterValue(v)}
    />
  );
};
