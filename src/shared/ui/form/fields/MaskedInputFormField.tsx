import type { FactoryOpts } from "imask";
import type { FieldPathByValue, FieldValues } from "react-hook-form";

import { MaskedInput, type MaskedInputProps } from "../../masked-input";
import { FormField } from "../primitives/FormField";
import type { FormAdapterProps } from "../types";
import { resolveFieldVariant } from "./form-field-utils";

export type MaskedInputFormFieldProps<
  TFormData extends FieldValues,
  TName extends FieldPathByValue<TFormData, string | undefined>,
  TMask extends FactoryOpts,
> = FormAdapterProps<TFormData, TName> &
  Omit<
    MaskedInputProps<TMask>,
    "defaultValue" | "disabled" | "id" | "name" | "value"
  >;

/**
 * @example
 * <MaskedInputFormField<TForm> name="phone" label="Phone" mask={phoneMask} />
 */
export const MaskedInputFormField = <
  TFormData extends FieldValues,
  TName extends FieldPathByValue<TFormData, string | undefined> =
    FieldPathByValue<TFormData, string | undefined>,
  TMask extends FactoryOpts = FactoryOpts,
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
  ...maskedInputProps
}: MaskedInputFormFieldProps<TFormData, TName, TMask>): React.ReactElement => {
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
        <MaskedInput
          {...maskedInputProps}
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
          onChange={info => {
            field.onChange(info.unmaskedValue);
            onChange?.(info);
          }}
          onClear={() => {
            field.onChange("");
            onClear?.();
          }}
        />
      )}
    />
  );
};
