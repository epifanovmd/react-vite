import * as React from "react";
import {
  type Control,
  Controller,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Field } from "./Field";
import type { FieldProps } from "./types";

export interface FormFieldProps<
  TFormData extends FieldValues,
  TName extends Path<TFormData> = Path<TFormData>,
> extends Omit<FieldProps, "children" | "error" | "htmlFor"> {
  name: TName;
  control?: Control<TFormData>;
  render: (
    field: ControllerRenderProps<TFormData, TName>,
    fieldState: ControllerFieldState,
  ) => React.ReactNode;
}

export function FormField<
  TFormData extends FieldValues,
  TName extends Path<TFormData> = Path<TFormData>,
>({
  name,
  control,
  label,
  hint,
  description,
  required,
  fieldClassName,
  render,
}: FormFieldProps<TFormData, TName>): React.ReactElement {
  return (
    <Controller
      name={name}
      control={control as unknown as Control<FieldValues> | undefined}
      render={({ field, fieldState }) => (
        <Field
          label={label}
          hint={hint}
          description={description}
          error={fieldState.error?.message}
          required={required}
          htmlFor={name}
          fieldClassName={fieldClassName}
        >
          {render(
            field as unknown as ControllerRenderProps<TFormData, TName>,
            fieldState,
          )}
        </Field>
      )}
    />
  );
}
