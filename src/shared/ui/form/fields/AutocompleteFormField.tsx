import type { FieldPathByValue, FieldValues } from "react-hook-form";

import { Autocomplete, type AutocompleteProps } from "../../select";
import { FormField } from "../primitives/FormField";
import type { FormAdapterProps } from "../types";
import { resolveFieldVariant } from "./form-field-utils";

export type AutocompleteFormFieldProps<
  TFormData extends FieldValues,
  TName extends FieldPathByValue<TFormData, string | undefined>,
> = FormAdapterProps<TFormData, TName> &
  Omit<AutocompleteProps, "disabled" | "id" | "onChange" | "value"> & {
    onValueChange?: (value: string) => void;
  };

/** @example <AutocompleteFormField<TForm> name="city" label="City" options={options} /> */
export function AutocompleteFormField<
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
  onValueChange,
  onBlur,
  onOpenChange,
  variant,
  ...autocompleteProps
}: AutocompleteFormFieldProps<TFormData, TName>): React.ReactElement {
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
        <Autocomplete
          {...autocompleteProps}
          {...controlProps}
          ref={field.ref}
          disabled={field.disabled}
          value={String(field.value ?? "")}
          variant={resolveFieldVariant(variant, fieldState.invalid)}
          onBlur={event => {
            field.onBlur();
            onBlur?.(event);
          }}
          onOpenChange={open => {
            if (!open) field.onBlur();
            onOpenChange?.(open);
          }}
          onChange={value => {
            field.onChange(value);
            onValueChange?.(value);
          }}
        />
      )}
    />
  );
}
