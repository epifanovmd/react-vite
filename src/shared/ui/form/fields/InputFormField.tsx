import type { FieldPathByValue, FieldValues } from "react-hook-form";

import { Input, type InputProps } from "../../input";
import { FormField } from "../primitives/FormField";
import type { FormAdapterProps } from "../types";
import { resolveFieldVariant } from "./form-field-utils";

export type InputFormFieldProps<
  TFormData extends FieldValues,
  TName extends FieldPathByValue<TFormData, string | undefined>,
> = FormAdapterProps<TFormData, TName> &
  Omit<
    InputProps,
    "defaultValue" | "disabled" | "id" | "name" | "required" | "value"
  >;

/**
 * String input connected to RHF.
 *
 * @example
 * <InputFormField<TForm> name="email" label="Email" type="email" />
 */
export function InputFormField<
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
  onClear,
  variant,
  ...inputProps
}: InputFormFieldProps<TFormData, TName>): React.ReactElement {
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
        <Input
          {...inputProps}
          {...controlProps}
          ref={field.ref}
          disabled={field.disabled}
          required={required}
          value={String(field.value ?? "")}
          variant={resolveFieldVariant(variant, fieldState.invalid)}
          onBlur={event => {
            field.onBlur();
            onBlur?.(event);
          }}
          onChange={event => {
            field.onChange(event.target.value);
            onChange?.(event);
          }}
          onClear={() => {
            field.onChange("");
            onClear?.();
          }}
        />
      )}
    />
  );
}
