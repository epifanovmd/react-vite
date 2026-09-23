import type { FieldPathByValue, FieldValues } from "react-hook-form";

import { Segmented, type SegmentedProps } from "../../segmented";
import { FormField } from "../primitives/FormField";
import type { FormAdapterProps } from "../types";

export type SegmentedFormFieldProps<
  TFormData extends FieldValues,
  TName extends FieldPathByValue<TFormData, string | undefined>,
> = FormAdapterProps<TFormData, TName> &
  Omit<SegmentedProps, "defaultValue" | "id" | "onChange" | "value"> & {
    onValueChange?: (value: string) => void;
  };

/** @example <SegmentedFormField<TForm> name="view" label="View" options={options} /> */
export const SegmentedFormField = <
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
  ...segmentedProps
}: SegmentedFormFieldProps<TFormData, TName>): React.ReactElement => {
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
      render={({ field, controlProps }) => (
        <Segmented
          {...segmentedProps}
          {...controlProps}
          disabled={field.disabled}
          value={String(field.value ?? "")}
          onBlur={event => {
            field.onBlur();
            onBlur?.(event);
          }}
          onChange={value => {
            field.onChange(value);
            onValueChange?.(value);
          }}
        />
      )}
    />
  );
};
