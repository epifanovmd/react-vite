import type { FieldPath, FieldValues } from "react-hook-form";

import {
  useRevalidateFields,
  type UseRevalidateFieldsOptions,
} from "../model/use-revalidate-fields";

export type FormRevalidateProps<
  TFormData extends FieldValues,
  TDependencies extends readonly FieldPath<TFormData>[],
  TTargets extends readonly FieldPath<TFormData>[],
> = UseRevalidateFieldsOptions<TFormData, TDependencies, TTargets>;

/**
 * Declarative cross-field revalidation placed inside Form.
 *
 * @example
 * <FormRevalidate dependencies={["password"]} targets={["confirmPassword"]} />
 */
export function FormRevalidate<
  TFormData extends FieldValues,
  TDependencies extends readonly FieldPath<TFormData>[],
  TTargets extends readonly FieldPath<TFormData>[],
>(props: FormRevalidateProps<TFormData, TDependencies, TTargets>): null {
  useRevalidateFields(props);

  return null;
}
