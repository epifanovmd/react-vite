import {
  type FieldArrayPath,
  type FieldValues,
  useFieldArray,
  type UseFieldArrayProps,
  type UseFieldArrayReturn,
} from "react-hook-form";

/**
 * Discoverable typed alias for RHF field arrays used by the form kit.
 *
 * @example
 * const phones = useFormFieldArray<TForm>({ name: "phones" });
 */
export const useFormFieldArray = <
  TFormData extends FieldValues,
  TName extends FieldArrayPath<TFormData> = FieldArrayPath<TFormData>,
  TKeyName extends string = "id",
>(
  options: UseFieldArrayProps<TFormData, TName, TKeyName>,
): UseFieldArrayReturn<TFormData, TName, TKeyName> => {
  return useFieldArray(options);
};
