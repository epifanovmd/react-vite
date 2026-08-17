import type { FieldVariantProps } from "../../foundation/field-variants";

type FieldVariant = FieldVariantProps["variant"];

export const resolveFieldVariant = (
  variant: FieldVariant,
  invalid: boolean,
): FieldVariant => {
  if (!invalid) return variant;

  return variant === "filled" || variant === "filled-success"
    ? "filled-error"
    : "error";
};
