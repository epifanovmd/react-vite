import { Input } from "../../input";
import { createFormField } from "../createFormField";

export const InputFormField = createFormField(Input, (field, fieldState) => ({
  id: field.name,
  ref: field.ref,
  value: (field.value ?? "") as string,
  onChange: field.onChange,
  onBlur: field.onBlur,
  onClear: () => field.onChange(""),
  variant: fieldState.invalid ? ("error" as const) : undefined,
}));
