import * as React from "react";
import {
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";

import type { FormAdapterProps, FormFieldRenderProps } from "../types";
import { Field } from "./Field";

export interface FormFieldProps<
  TFormData extends FieldValues,
  TName extends FieldPath<TFormData> = FieldPath<TFormData>,
> extends FormAdapterProps<TFormData, TName> {
  render: (props: FormFieldRenderProps<TFormData, TName>) => React.ReactNode;
}

/**
 * Headless RHF field with shared label, error and accessibility wiring.
 *
 * @example
 * <FormField name="email" label="Email" render={({ field, controlProps }) => (
 *   <Input {...controlProps} {...field} />
 * )} />
 */
export function FormField<
  TFormData extends FieldValues,
  TName extends FieldPath<TFormData> = FieldPath<TFormData>,
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
  render,
}: FormFieldProps<TFormData, TName>): React.ReactElement {
  const generatedId = React.useId();
  const controlId = id ?? `${generatedId}-control`;
  const labelId = label !== undefined ? `${generatedId}-label` : undefined;
  const descriptionId =
    description !== undefined ? `${generatedId}-description` : undefined;
  const { field, fieldState, formState } = useController({
    name,
    control,
    rules,
    shouldUnregister,
    defaultValue,
    disabled,
  });
  const errorId = fieldState.error ? `${generatedId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ");

  return (
    <Field
      label={label}
      labelPlacement={labelPlacement}
      hint={hint}
      description={description}
      descriptionId={descriptionId}
      error={fieldState.error?.message}
      errorId={errorId}
      required={required}
      htmlFor={controlId}
      labelId={labelId}
      fieldClassName={fieldClassName}
    >
      {render({
        field,
        fieldState,
        formState,
        controlProps: {
          id: controlId,
          name: field.name,
          "aria-describedby": describedBy || undefined,
          "aria-invalid": fieldState.invalid || undefined,
          "aria-labelledby": labelId,
          "aria-required": required || undefined,
        },
      })}
    </Field>
  );
}
