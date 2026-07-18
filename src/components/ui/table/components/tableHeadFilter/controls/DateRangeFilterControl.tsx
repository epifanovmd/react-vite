import type { DateRange } from "../../../../date-picker";
import { DateRangePicker } from "../../../../date-picker";
import type { FilterControlProps } from "./FilterControlProps";

export interface DateRangeFilterConfig {
  type: "daterange";
  placeholder?: string;
  queryKey?: string;
}

export const DateRangeFilterControl = <TData,>({
  config,
  column,
}: FilterControlProps<DateRangeFilterConfig, TData>) => (
  <DateRangePicker
    size="sm"
    clearable
    placeholder={config.placeholder}
    value={column.getFilterValue() as DateRange | undefined}
    onChange={(range: DateRange | undefined) => column.setFilterValue(range)}
  />
);
