import type { FieldPathByValue, FieldValues } from "react-hook-form";

import { Switch, type SwitchProps } from "../../switch";
import { FormField } from "../primitives/FormField";
import type { FormAdapterProps } from "../types";

export type SwitchFormFieldProps<
  TFormData extends FieldValues,
  TName extends FieldPathByValue<TFormData, boolean | undefined>,
> = FormAdapterProps<TFormData, TName> &
  Omit<SwitchProps, "checked" | "disabled" | "id" | "name">;

/** @example <SwitchFormField<TForm> name="notifications" label="Alerts" /> */
export function SwitchFormField<
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
  ...switchProps
}: SwitchFormFieldProps<TFormData, TName>): React.ReactElement {
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
        <Switch
          {...switchProps}
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
            field.onChange(value);
            onCheckedChange?.(value);
          }}
        />
      )}
    />
  );
}
