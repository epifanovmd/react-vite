import * as React from "react";
import {
  type FieldPath,
  type FieldValues,
  useFormContext,
  useWatch,
} from "react-hook-form";

export type RevalidationMode = "always" | "submitted" | "touched-or-submitted";

export interface UseRevalidateFieldsOptions<
  TFormData extends FieldValues,
  TDependencies extends readonly FieldPath<TFormData>[],
  TTargets extends readonly FieldPath<TFormData>[],
> {
  dependencies: readonly [...TDependencies];
  targets: readonly [...TTargets];
  mode?: RevalidationMode;
}

/**
 * Revalidates target fields after a dependency changes without subscribing the whole form.
 *
 * @example
 * useRevalidateFields({
 *   dependencies: ["password"] as const,
 *   targets: ["confirmPassword"] as const,
 * });
 */
export function useRevalidateFields<
  TFormData extends FieldValues,
  TDependencies extends readonly FieldPath<TFormData>[],
  TTargets extends readonly FieldPath<TFormData>[],
>({
  dependencies,
  targets,
  mode = "touched-or-submitted",
}: UseRevalidateFieldsOptions<TFormData, TDependencies, TTargets>): void {
  const { control, formState, getFieldState, trigger } =
    useFormContext<TFormData>();
  const values = useWatch({ control, name: dependencies, exact: true });
  const mounted = React.useRef(false);
  const previousValues = React.useRef<readonly unknown[] | undefined>(
    undefined,
  );
  const targetsRef = React.useRef(targets);

  targetsRef.current = targets;

  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      previousValues.current = values;

      return;
    }

    if (
      previousValues.current?.every((value, index) =>
        Object.is(value, values[index]),
      )
    ) {
      return;
    }

    previousValues.current = values;

    const fields = targetsRef.current.filter(target => {
      if (mode === "always") return true;
      if (mode === "submitted") return formState.isSubmitted;

      return formState.isSubmitted || getFieldState(target).isTouched;
    });

    if (fields.length > 0) void trigger(fields);
  }, [formState.isSubmitted, getFieldState, mode, trigger, values]);
}
