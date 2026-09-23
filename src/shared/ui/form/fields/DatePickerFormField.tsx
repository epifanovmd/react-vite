import type { FieldPathByValue, FieldValues } from "react-hook-form";

import { DatePicker, type DatePickerProps } from "../../date-picker";
import { FormField } from "../primitives/FormField";
import type { FormAdapterProps } from "../types";
import { resolveFieldVariant } from "./form-field-utils";

export type DatePickerFormFieldProps<
  TFormData extends FieldValues,
  TName extends FieldPathByValue<TFormData, Date | undefined>,
> = FormAdapterProps<TFormData, TName> &
  Omit<DatePickerProps, "disabled" | "id" | "name" | "value">;

/** @example <DatePickerFormField<TForm> name="birthDate" label="Birth date" /> */
export const DatePickerFormField = <
  TFormData extends FieldValues,
  TName extends FieldPathByValue<TFormData, Date | undefined> =
    FieldPathByValue<TFormData, Date | undefined>,
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
  variant,
  ...datePickerProps
}: DatePickerFormFieldProps<TFormData, TName>): React.ReactElement => {
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
      render={({ field, fieldState, controlProps }) => (
        <DatePicker
          {...datePickerProps}
          {...controlProps}
          ref={field.ref}
          disabled={field.disabled}
          value={field.value}
          variant={resolveFieldVariant(variant, fieldState.invalid)}
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
};
