import * as React from "react";
import {
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
  useFormContext,
  useWatch,
} from "react-hook-form";

export interface UseAsyncFieldValidationOptions<
  TFormData extends FieldValues,
  TName extends FieldPath<TFormData>,
> {
  name: TName;
  validate: (
    value: FieldPathValue<TFormData, TName>,
    signal: AbortSignal,
  ) => Promise<string | undefined>;
  debounce?: number;
  enabled?: boolean;
  shouldValidate?: (value: FieldPathValue<TFormData, TName>) => boolean;
}

export interface UseAsyncFieldValidationResult {
  isValidating: boolean;
}

/**
 * Debounced cancellable server validation for one field. Keep deterministic
 * validation in Zod and use this hook for checks such as username availability.
 *
 * @example
 * useAsyncFieldValidation({ name: "username", validate: checkUsername });
 */
export function useAsyncFieldValidation<
  TFormData extends FieldValues,
  TName extends FieldPath<TFormData>,
>({
  name,
  validate,
  debounce = 300,
  enabled = true,
  shouldValidate,
}: UseAsyncFieldValidationOptions<
  TFormData,
  TName
>): UseAsyncFieldValidationResult {
  const { control, clearErrors, getFieldState, setError } =
    useFormContext<TFormData>();
  const value = useWatch({ control, name, exact: true });
  const [isValidating, setIsValidating] = React.useState(false);

  React.useEffect(() => {
    if (!enabled || (shouldValidate && !shouldValidate(value))) {
      setIsValidating(false);
      if (getFieldState(name).error?.type === "async") clearErrors(name);

      return;
    }

    const abortController = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsValidating(true);

      try {
        const message = await validate(value, abortController.signal);

        if (abortController.signal.aborted) return;

        if (message) {
          setError(name, { type: "async", message });
        } else if (getFieldState(name).error?.type === "async") {
          clearErrors(name);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          setError(name, {
            type: "async",
            message:
              error instanceof Error
                ? error.message
                : "Async validation failed",
          });
        }
      } finally {
        if (!abortController.signal.aborted) setIsValidating(false);
      }
    }, debounce);

    return () => {
      window.clearTimeout(timeout);
      abortController.abort();
    };
  }, [
    clearErrors,
    debounce,
    enabled,
    getFieldState,
    name,
    setError,
    shouldValidate,
    validate,
    value,
  ]);

  return { isValidating };
}
