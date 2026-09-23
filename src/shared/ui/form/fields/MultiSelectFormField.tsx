import type { FieldPathByValue, FieldValues } from "react-hook-form";

import { Select, type SelectProps, type SelectValue } from "../../select";
import { FormField } from "../primitives/FormField";
import type { FormAdapterProps } from "../types";
import { resolveFieldVariant } from "./form-field-utils";

type ManagedSelectProps =
  "disabled" | "id" | "labelInValue" | "multi" | "onChange" | "value";

export type MultiSelectFormFieldProps<
  TFormData extends FieldValues,
  TValue extends SelectValue,
  TName extends FieldPathByValue<TFormData, TValue[] | undefined>,
> = FormAdapterProps<TFormData, TName> &
  Omit<SelectProps<TValue>, ManagedSelectProps> & {
    onValueChange?: (value: TValue[]) => void;
  };

/** @example <MultiSelectFormField<TForm> name="roles" label="Roles" options={options} /> */
export const MultiSelectFormField = <
  TFormData extends FieldValues,
  TValue extends SelectValue = string,
  TName extends FieldPathByValue<TFormData, TValue[] | undefined> =
    FieldPathByValue<TFormData, TValue[] | undefined>,
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
  onValueChange,
  onBlur,
  onOpenChange,
  variant,
  ...selectProps
}: MultiSelectFormFieldProps<TFormData, TValue, TName>): React.ReactElement => {
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
        <Select<TValue>
          {...selectProps}
          {...controlProps}
          ref={field.ref}
          multi
          labelInValue={false}
          disabled={field.disabled}
          value={(field.value ?? []) as TValue[]}
          variant={resolveFieldVariant(variant, fieldState.invalid)}
          onBlur={event => {
            field.onBlur();
            onBlur?.(event);
          }}
          onOpenChange={open => {
            if (!open) field.onBlur();
            onOpenChange?.(open);
          }}
          onChange={(value: TValue[]) => {
            field.onChange(value);
            onValueChange?.(value);
          }}
        />
      )}
    />
  );
};
