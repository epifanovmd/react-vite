import { DatePicker } from "../../../../date-picker";
import type { FilterControlProps } from "./FilterControlProps";

export interface DateFilterConfig {
  type: "date";
  placeholder?: string;
  queryKey?: string;
}

export const DateFilterControl = <TData,>({
  config,
  column,
}: FilterControlProps<DateFilterConfig, TData>) => (
  <DatePicker
    size="sm"
    clearable
    placeholder={config.placeholder}
    value={column.getFilterValue() as Date | undefined}
    onChange={(date: Date | undefined) => column.setFilterValue(date)}
  />
);
