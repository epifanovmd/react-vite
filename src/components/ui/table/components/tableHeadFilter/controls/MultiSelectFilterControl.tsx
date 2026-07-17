import { useMemo } from "react";

import type { LabeledValue } from "../../../../select";
import { Select } from "../../../../select";
import {
  useAsyncOptions,
  useStaticOptions,
} from "../../../../select/strategies";
import type { ColumnFilterOption } from "./ColumnFilterOption";
import type { FilterControlProps } from "./FilterControlProps";

export interface MultiSelectFilterConfig<T = string> {
  type: "multiselect";
  options?: ColumnFilterOption<T>[];
  fetchOptions?: (query: string) => Promise<ColumnFilterOption<T>[]>;
  queryKey?: string;
  labelInValue?: boolean;
  faceted?: boolean;
}

export const MultiSelectFilterControl = <TData,>({
  config,
  column,
}: FilterControlProps<MultiSelectFilterConfig, TData>) => {
  const { fetchOptions, labelInValue, faceted } = config;

  const uniqueValues = faceted ? column.getFacetedUniqueValues() : undefined;
  const options = useMemo(() => {
    if (!faceted || !config.options) return config.options;

    return config.options.map(option => ({
      ...option,
      label: (
        <span className={"flex gap-1"}>
          {option.label}
          <span className="text-muted-foreground">
            ({uniqueValues?.get(option.value) ?? 0})
          </span>
        </span>
      ),
    }));
  }, [config.options, faceted, uniqueValues]);

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
