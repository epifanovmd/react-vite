import type { FieldPathByValue, FieldValues } from "react-hook-form";

import {
  MaskedDatePicker,
  type MaskedDatePickerProps,
} from "../../date-picker";
import { FormField } from "../primitives/FormField";
import type { FormAdapterProps } from "../types";
import { resolveFieldVariant } from "./form-field-utils";

export type MaskedDatePickerFormFieldProps<
  TFormData extends FieldValues,
  TName extends FieldPathByValue<TFormData, Date | undefined>,
> = FormAdapterProps<TFormData, TName> &
  Omit<MaskedDatePickerProps, "disabled" | "id" | "name" | "value">;

/** @example <MaskedDatePickerFormField<TForm> name="date" label="Date" /> */
export const MaskedDatePickerFormField = <
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
  ...pickerProps
}: MaskedDatePickerFormFieldProps<TFormData, TName>): React.ReactElement => {
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
        <MaskedDatePicker
          {...pickerProps}
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
