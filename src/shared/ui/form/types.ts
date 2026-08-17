import * as React from "react";
import type {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseControllerProps,
  UseFormStateReturn,
} from "react-hook-form";

export interface FieldProps {
  label?: React.ReactNode;
  labelPlacement?: "outside" | "floating";
  hint?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  /** Visual and ARIA state only; validation remains owned by RHF/Zod rules. */
  required?: boolean;
  htmlFor?: string;
  labelId?: string;
  descriptionId?: string;
  errorId?: string;
  fieldClassName?: string;
  children?: React.ReactNode;
}

export interface FormFieldBaseProps<
  TFormData extends FieldValues = FieldValues,
  TName extends FieldPath<TFormData> = FieldPath<TFormData>,
> {
  name: TName;
  control?: Control<TFormData>;
}

export interface FormControlProps {
  id: string;
  name: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  "aria-labelledby"?: string;
  "aria-required"?: true;
}

export interface FormFieldRenderProps<
  TFormData extends FieldValues,
  TName extends FieldPath<TFormData>,
> {
  field: ControllerRenderProps<TFormData, TName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<TFormData>;
  controlProps: FormControlProps;
}

export type FormControllerOptions<
  TFormData extends FieldValues,
  TName extends FieldPath<TFormData>,
> = Pick<
  UseControllerProps<TFormData, TName>,
  "control" | "defaultValue" | "disabled" | "rules" | "shouldUnregister"
>;

export type FormFieldLayoutProps = Omit<
  FieldProps,
  "children" | "descriptionId" | "error" | "errorId" | "htmlFor"
> & {
  id?: string;
};

export type FormAdapterProps<
  TFormData extends FieldValues,
  TName extends FieldPath<TFormData>,
> = FormFieldBaseProps<TFormData, TName> &
  FormControllerOptions<TFormData, TName> &
  FormFieldLayoutProps;
