import { RadioGroup } from "../../radio";
import { createFormField } from "../createFormField";

/**
 * RadioGroup wired to react-hook-form. Pass the `<Radio>` options as children.
 *
 * <RadioFormField name="plan" control={control} label="Тариф">
 *   <Radio value="free" label="Free" />
 *   <Radio value="pro" label="Pro" />
 * </RadioFormField>
 */
export const RadioFormField = createFormField(
  RadioGroup,
  (field, fieldState) => ({
    name: field.name,
    value: (field.value as string | undefined) ?? "",
    onChange: field.onChange,
    variant: fieldState.invalid ? ("error" as const) : undefined,
  }),
);
