import type { FieldPathByValue, FieldValues } from "react-hook-form";

import { Select, type SelectProps, type SelectValue } from "../../select";
import { FormField } from "../primitives/FormField";
import type { FormAdapterProps } from "../types";
import { resolveFieldVariant } from "./form-field-utils";

type ManagedSelectProps =
  | "clearable"
  | "disabled"
  | "id"
  | "labelInValue"
  | "multi"
  | "onChange"
  | "value";

export type SelectFormFieldProps<
  TFormData extends FieldValues,
  TValue extends SelectValue,
  TName extends FieldPathByValue<TFormData, TValue | null | undefined>,
> = FormAdapterProps<TFormData, TName> &
  Omit<SelectProps<TValue>, ManagedSelectProps> & {
    clearable?: true;
    onValueChange?: (value: TValue | null) => void;
  };

/**
 * Type-safe single Select adapter. Use MultiSelectFormField for array values.
 *
 * @example
 * <SelectFormField<TForm> name="country" label="Country" options={options} />
 */
export function SelectFormField<
  TFormData extends FieldValues,
  TValue extends SelectValue = string,
  TName extends FieldPathByValue<TFormData, TValue | null | undefined> =
    FieldPathByValue<TFormData, TValue | null | undefined>,
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
  clearable = true,
  onValueChange,
  onBlur,
  onOpenChange,
  variant,
  ...selectProps
}: SelectFormFieldProps<TFormData, TValue, TName>): React.ReactElement {
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
          multi={false}
          labelInValue={false}
          clearable={clearable}
          disabled={field.disabled}
          value={(field.value ?? null) as TValue | null}
          variant={resolveFieldVariant(variant, fieldState.invalid)}
          onBlur={event => {
            field.onBlur();
            onBlur?.(event);
          }}
          onOpenChange={open => {
            if (!open) field.onBlur();
            onOpenChange?.(open);
          }}
          onChange={(value: TValue | null) => {
            field.onChange(value);
            onValueChange?.(value);
          }}
        />
      )}
    />
  );
}
