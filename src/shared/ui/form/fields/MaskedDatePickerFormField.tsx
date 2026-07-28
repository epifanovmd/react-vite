import { MaskedDatePicker } from "../../date-picker";
import { createFormField } from "../createFormField";

export const MaskedDatePickerFormField = createFormField(
  MaskedDatePicker,
  (field, fieldState) => ({
    value: field.value as Date | undefined,
    onChange: field.onChange,
    variant: fieldState.invalid ? ("error" as const) : undefined,
  }),
);
