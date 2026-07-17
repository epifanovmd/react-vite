import type { LabeledValue } from "../../../../select";
import { Select } from "../../../../select";
import { useAsyncOptions, useStaticOptions } from "../../../../select/strategies";
import type { ColumnFilterOption } from "./ColumnFilterOption";
import type { FilterControlProps } from "./FilterControlProps";

export interface MultiSelectFilterConfig<T = string> {
  type: "multiselect";
  options?: ColumnFilterOption<T>[];
  fetchOptions?: (query: string) => Promise<ColumnFilterOption<T>[]>;
  queryKey?: string;
  labelInValue?: boolean;
}

export const MultiSelectFilterControl = <TData,>({
  config,
  column,
}: FilterControlProps<MultiSelectFilterConfig, TData>) => {
  const { options, fetchOptions, labelInValue } = config;

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
      <Select
        {...props}
        multi
        clearable
        labelInValue
        size="sm"
        placeholder="Все"
        value={(column.getFilterValue() as LabeledValue[] | undefined) ?? []}
        onChange={(v: LabeledValue[]) => column.setFilterValue(v)}
      />
    );
  }

  return (
    <Select
      {...props}
      multi
      clearable
      size="sm"
      placeholder="Все"
      value={(column.getFilterValue() as string[] | undefined) ?? []}
      onChange={(v: string[]) => column.setFilterValue(v)}
    />
  );
};
