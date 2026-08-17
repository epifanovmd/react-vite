import type { FieldPathByValue, FieldValues } from "react-hook-form";

import { RadioGroup, type RadioGroupProps } from "../../radio";
import { FormField } from "../primitives/FormField";
import type { FormAdapterProps } from "../types";

export type RadioFormFieldProps<
  TFormData extends FieldValues,
  TName extends FieldPathByValue<TFormData, string | undefined>,
> = FormAdapterProps<TFormData, TName> &
  Omit<RadioGroupProps, "defaultValue" | "disabled" | "name" | "value">;

/**
 * @example
 * <RadioFormField<TForm> name="plan" label="Plan">
 *   <Radio value="free" label="Free" />
 * </RadioFormField>
 */
export function RadioFormField<
  TFormData extends FieldValues,
  TName extends FieldPathByValue<TFormData, string | undefined> =
    FieldPathByValue<TFormData, string | undefined>,
>({
  name,
  control,
  rules,
  shouldUnregister,
  defaultValue,
  disabled,
  id,
  label,
  labelPlacement,
  hint,
  description,
  required,
  fieldClassName,
  onChange,
  onBlur,
  ...radioProps
}: RadioFormFieldProps<TFormData, TName>): React.ReactElement {
  return (
    <FormField
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={shouldUnregister}
      defaultValue={defaultValue}
      disabled={disabled}
      id={id}
      label={label}
      labelPlacement={labelPlacement}
      hint={hint}
      description={description}
      required={required}
      fieldClassName={fieldClassName}
      render={({ field, controlProps }) => (
        <RadioGroup
          {...radioProps}
          {...controlProps}
          value={String(field.value ?? "")}
          disabled={field.disabled}
          onBlur={event => {
            field.onBlur();
            onBlur?.(event);
          }}
          onChange={value => {
            field.onChange(value);
            onChange?.(value);
          }}
        />
      )}
    />
  );
}
