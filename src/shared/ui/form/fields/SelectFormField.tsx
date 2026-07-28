import * as React from "react";
import { type Control, type FieldValues, type Path } from "react-hook-form";

import {
  type ISelectRef,
  Select,
  type SelectProps,
  type SelectValue,
} from "../../select";
import { createFormField } from "../createFormField";
import type { FieldProps } from "../types";

type FieldOwnProps = Omit<FieldProps, "children" | "error" | "htmlFor">;

type MappedProps = "ref" | "value" | "clearable" | "onChange" | "variant";

const SelectFormFieldBase = createFormField(
  Select as React.ComponentType<SelectProps<string>>,
  (field, fieldState, ownProps) => ({
    ref: field.ref as React.Ref<ISelectRef>,
    value: (field.value as string | null | undefined) ?? null,
    clearable: true as const,
    onChange: (v: string | null) => field.onChange(v ?? undefined),
    onOpenChange: (open: boolean) => {
      if (!open) field.onBlur();
      ownProps.onOpenChange?.(open);
    },
    variant: fieldState.invalid ? ("error" as const) : undefined,
  }),
);

export const SelectFormField = SelectFormFieldBase as <
  TFormData extends FieldValues = FieldValues,
  V extends SelectValue = string,
>(
  props: {
    name: Path<TFormData>;
    control?: Control<TFormData>;
  } & FieldOwnProps &
    Omit<SelectProps<V>, MappedProps>,
) => React.ReactElement;
