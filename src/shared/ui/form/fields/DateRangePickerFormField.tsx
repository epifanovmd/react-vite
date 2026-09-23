import type { FieldPathByValue, FieldValues } from "react-hook-form";

import {
  type DateRange,
  DateRangePicker,
  type DateRangePickerProps,
} from "../../date-picker";
import { FormField } from "../primitives/FormField";
import type { FormAdapterProps } from "../types";
import { resolveFieldVariant } from "./form-field-utils";

export type DateRangePickerFormFieldProps<
  TFormData extends FieldValues,
  TName extends FieldPathByValue<TFormData, DateRange | undefined>,
> = FormAdapterProps<TFormData, TName> &
  Omit<DateRangePickerProps, "disabled" | "id" | "name" | "value">;

/** @example <DateRangePickerFormField<TForm> name="period" label="Period" /> */
export const DateRangePickerFormField = <
  TFormData extends FieldValues,
  TName extends FieldPathByValue<TFormData, DateRange | undefined> =
    FieldPathByValue<TFormData, DateRange | undefined>,
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
  ...dateRangePickerProps
}: DateRangePickerFormFieldProps<TFormData, TName>): React.ReactElement => {
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
        <DateRangePicker
          {...dateRangePickerProps}
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
