import { Textarea } from "../../textarea";
import { createFormField } from "../createFormField";

export const TextareaFormField = createFormField(
  Textarea,
  (field, fieldState) => ({
    id: field.name,
    ref: field.ref,
    value: (field.value ?? "") as string,
    onChange: field.onChange,
    onBlur: field.onBlur,
    variant: fieldState.invalid ? ("error" as const) : undefined,
  }),
);
