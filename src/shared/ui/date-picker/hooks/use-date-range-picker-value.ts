import { format } from "date-fns";
import { useMemo } from "react";

import type { DateRange } from "../types";

export interface UseDateRangePickerValueOptions {
  value?: DateRange;
  dateFormat: string;
  clearable?: boolean;
  disabled?: boolean;
}

export interface UseDateRangePickerValueResult {
  hasValue: boolean;
  showClear: boolean;
  label: string | null;
}

export const useDateRangePickerValue = ({
  value,
  dateFormat,
  clearable,
  disabled,
}: UseDateRangePickerValueOptions): UseDateRangePickerValueResult => {
  const hasValue = !!value?.from;
  const showClear = !!clearable && hasValue && !disabled;

  const label = useMemo(() => {
    if (!value?.from) return null;
    if (value.to)
      return `${format(value.from, dateFormat)} — ${format(value.to, dateFormat)}`;

    return format(value.from, dateFormat);
  }, [value, dateFormat]);

  return { hasValue, showClear, label };
};
