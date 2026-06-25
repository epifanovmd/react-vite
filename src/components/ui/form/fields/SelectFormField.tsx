import * as React from "react";
import { type Control, type FieldValues, type Path } from "react-hook-form";

import { Select, type SelectHandle, type SelectProps } from "../../select";
import { FormField } from "../FormField";
import type { FieldProps } from "../types";

type FieldOwnProps = Omit<FieldProps, "children" | "error" | "htmlFor">;

type MappedProps = "ref" | "value" | "clearable" | "onChange" | "variant";

export function SelectFormField<
  TFormData extends FieldValues = FieldValues,
  V extends string = string,
>({
  name,
  control,
  label,
  hint,
  description,
  required,
  fieldClassName,
  onOpenChange,
  ...selectProps
}: {
  name: Path<TFormData>;
  control?: Control<TFormData>;
} & FieldOwnProps &
  Omit<SelectProps<V>, MappedProps>): React.ReactElement {
  return (
    <FormField<TFormData>
      name={name}
      control={control}
      label={label}
      hint={hint}
      description={description}
      required={required}
      fieldClassName={fieldClassName}
      render={(field, fieldState) => (
        <Select<V>
          {...({
            ...selectProps,
            ref: field.ref as React.Ref<SelectHandle>,
            value: (field.value as V | null | undefined) ?? null,
            clearable: true,
            onChange: (v: V | null) => field.onChange(v ?? undefined),
            onOpenChange: (open: boolean) => {
              if (!open) field.onBlur();
              onOpenChange?.(open);
            },
            variant: fieldState.invalid ? "error" : undefined,
          } as SelectProps<V> & { ref?: React.Ref<SelectHandle> })}
        />
      )}
    />
  );
}

SelectFormField.displayName = "SelectFormField";
