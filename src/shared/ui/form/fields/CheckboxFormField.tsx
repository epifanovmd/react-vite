import { Checkbox } from "../../checkbox";
import { createFormField } from "../createFormField";

export const CheckboxFormField = createFormField(
  Checkbox,
  (field, fieldState) => ({
    id: field.name,
    ref: field.ref,
    checked: Boolean(field.value) as boolean,
    onCheckedChange: field.onChange,
    variant: fieldState.invalid ? ("error" as const) : undefined,
  }),
);
