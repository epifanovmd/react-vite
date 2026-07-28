import { MaskedDateRangePicker } from "../../date-picker";
import { createFormField } from "../createFormField";

export const MaskedDateRangePickerFormField = createFormField(
  MaskedDateRangePicker,
  (field, fieldState) => ({
    value: field.value as { from?: Date; to?: Date } | undefined,
    onChange: field.onChange,
    variant: fieldState.invalid ? ("error" as const) : undefined,
  }),
);
