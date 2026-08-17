import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";

export interface ServerFieldError<TFormData extends FieldValues> {
  name: FieldPath<TFormData> | "root";
  message: string;
}

export interface ApplyServerErrorsOptions {
  focusFirst?: boolean;
}

/**
 * Applies normalized API errors to RHF fields and its root error.
 *
 * @example
 * applyServerErrors(form.setError, [{ name: "email", message: "Already used" }]);
 */
export const applyServerErrors = <TFormData extends FieldValues>(
  setError: UseFormSetError<TFormData>,
  errors: readonly ServerFieldError<TFormData>[],
  { focusFirst = true }: ApplyServerErrorsOptions = {},
): void => {
  errors.forEach((error, index) => {
    setError(
      error.name,
      { type: "server", message: error.message },
      {
        shouldFocus: focusFirst && index === 0 && error.name !== "root",
      },
    );
  });
};
