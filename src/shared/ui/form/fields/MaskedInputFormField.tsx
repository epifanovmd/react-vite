import { MaskedInput } from "../../masked-input";
import { createFormField } from "../createFormField";

export const MaskedInputFormField = createFormField(
  MaskedInput,
  (field, fieldState) => ({
    id: field.name,
    value: (field.value ?? "") as string,
    onChange: info => field.onChange(info.unmaskedValue),
    onBlur: field.onBlur,
    onClear: () => field.onChange(""),
    variant: fieldState.invalid ? ("error" as const) : undefined,
  }),
);
