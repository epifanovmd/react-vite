import { isValid, parseISO } from "date-fns";
import { useMemo } from "react";

export interface UseDatePickerValueOptions {
  value?: Date | string;
  clearable?: boolean;
  disabled?: boolean;
}

export interface UseDatePickerValueResult {
  value: Date | undefined;
  showClear: boolean;
}

export const useDatePickerValue = ({
  value: rawValue,
  clearable,
  disabled,
}: UseDatePickerValueOptions): UseDatePickerValueResult => {
  const value = useMemo(() => {
    const parsed = typeof rawValue === "string" ? parseISO(rawValue) : rawValue;

    return isValid(parsed) ? parsed : undefined;
  }, [rawValue]);

  const showClear = !!clearable && !!value && !disabled;

  return { value, showClear };
};
