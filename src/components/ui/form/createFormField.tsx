import * as React from "react";
import {
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { FormField } from "./FormField";
import type { FieldProps } from "./types";

type FieldOwnProps = Omit<FieldProps, "children" | "error" | "htmlFor">;

type ComponentWithRef<P> = React.ComponentType<
  P & { ref?: React.Ref<unknown> }
>;

export function createFormField<TComponentProps extends object>(
  Component:
    | React.ComponentType<TComponentProps>
    | React.ForwardRefExoticComponent<TComponentProps>,
  mapToProps: (
    field: ControllerRenderProps<FieldValues, string>,
    fieldState: ControllerFieldState,
  ) => Partial<TComponentProps>,
) {
  const C = Component as ComponentWithRef<TComponentProps>;

  function CreatedFormField<TFormData extends FieldValues>({
    name,
    control,
    label,
    hint,
    description,
    required,
    fieldClassName,
    ...componentProps
  }: {
    name: Path<TFormData>;

    control?: Control<TFormData>;
  } & FieldOwnProps &
    Partial<TComponentProps>): React.ReactElement {
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
          <C
            {...(componentProps as TComponentProps)}
            {...mapToProps(
              field as unknown as ControllerRenderProps<FieldValues, string>,
              fieldState,
            )}
          />
        )}
      />
    );
  }

  CreatedFormField.displayName = `${
    Component.displayName ?? Component.name ?? "Component"
  }FormField`;

  return CreatedFormField;
}
