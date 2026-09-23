import type { FieldPathByValue, FieldValues } from "react-hook-form";

import { Checkbox, type CheckboxProps } from "../../checkbox";
import { FormField } from "../primitives/FormField";
import type { FormAdapterProps } from "../types";

export type CheckboxFormFieldProps<
  TFormData extends FieldValues,
  TName extends FieldPathByValue<TFormData, boolean | undefined>,
> = FormAdapterProps<TFormData, TName> &
  Omit<CheckboxProps, "checked" | "disabled" | "id" | "name">;

/** @example <CheckboxFormField<TForm> name="accepted" label="I agree" /> */
export const CheckboxFormField = <
  TFormData extends FieldValues,
  TName extends FieldPathByValue<TFormData, boolean | undefined> =
    FieldPathByValue<TFormData, boolean | undefined>,
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
  onCheckedChange,
  onBlur,
  variant,
  ...checkboxProps
}: CheckboxFormFieldProps<TFormData, TName>): React.ReactElement => {
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
        <Checkbox
          {...checkboxProps}
          {...controlProps}
          ref={field.ref}
          checked={Boolean(field.value)}
          disabled={field.disabled}
          variant={fieldState.invalid ? "error" : variant}
          onBlur={event => {
            field.onBlur();
            onBlur?.(event);
          }}
          onCheckedChange={value => {
            field.onChange(value === true);
            onCheckedChange?.(value);
          }}
        />
      )}
    />
  );
};
