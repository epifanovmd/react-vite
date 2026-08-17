import * as React from "react";
import {
  type FieldPath,
  type FieldPathValue,
  type FieldPathValues,
  type FieldValues,
  useFormContext,
  useWatch,
} from "react-hook-form";

type HiddenValuePolicy<
  TFormData extends FieldValues,
  TName extends FieldPath<TFormData>,
> =
  | { hiddenValue?: "preserve" }
  | { hiddenValue: "clear"; clearValue: FieldPathValue<TFormData, TName> }
  | { hiddenValue: "unregister" };

export type UseFieldConditionOptions<
  TFormData extends FieldValues,
  TName extends FieldPath<TFormData>,
  TDependencies extends readonly FieldPath<TFormData>[],
> = {
  name: TName;
  dependencies: readonly [...TDependencies];
  when: (values: FieldPathValues<TFormData, TDependencies>) => boolean;
} & HiddenValuePolicy<TFormData, TName>;

export interface UseFieldConditionResult {
  active: boolean;
  required: boolean;
}

/**
 * Computes a conditional field state and applies an explicit hidden-value policy.
 * Render the field only when `active` is true and pass `required` to its adapter.
 *
 * @example
 * const company = useFieldCondition({
 *   name: "inn",
 *   dependencies: ["customerType"] as const,
 *   when: ([type]) => type === "company",
 *   hiddenValue: "clear",
 *   clearValue: "",
 * });
 */
export function useFieldCondition<
  TFormData extends FieldValues,
  TName extends FieldPath<TFormData>,
  TDependencies extends readonly FieldPath<TFormData>[],
>(
  options: UseFieldConditionOptions<TFormData, TName, TDependencies>,
): UseFieldConditionResult {
  const { name, dependencies, hiddenValue = "preserve" } = options;
  const clearValue =
    options.hiddenValue === "clear" ? options.clearValue : undefined;
  const { control, clearErrors, setValue, unregister } =
    useFormContext<TFormData>();
  const values = useWatch({
    control,
    name: dependencies,
    exact: true,
  });
  const active = options.when(values);
  const previousActive = React.useRef<boolean | undefined>(undefined);

  React.useEffect(() => {
    if (active || previousActive.current === false) {
      previousActive.current = active;

      return;
    }

    clearErrors(name);

    if (hiddenValue === "clear") {
      setValue(name, clearValue as FieldPathValue<TFormData, TName>);
    } else if (hiddenValue === "unregister") {
      unregister(name);
    }

    previousActive.current = false;
  }, [
    active,
    clearErrors,
    clearValue,
    hiddenValue,
    name,
    setValue,
    unregister,
  ]);

  return { active, required: active };
}
