import * as React from "react";
import type {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

export interface FieldProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  fieldClassName?: string;
  children?: React.ReactNode;
}

export interface FormFieldBaseProps<
  TFormData extends FieldValues = FieldValues,
> {
  name: Path<TFormData>;
  control: Control<TFormData>;
}

export type ControllerMapper<TComponentProps extends object> = (
  field: ControllerRenderProps<FieldValues, string>,
  fieldState: ControllerFieldState,
  ownProps: Partial<TComponentProps>,
) => Partial<TComponentProps>;

export type CreatedFormFieldProps<
  TFormData extends FieldValues,
  TComponentProps extends object,
  TMappedProps extends Partial<TComponentProps>,
> = FormFieldBaseProps<TFormData> &
  Omit<FieldProps, "children" | "error" | "htmlFor"> &
  Omit<TComponentProps, keyof TMappedProps>;
