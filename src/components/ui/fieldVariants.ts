import { cva, type VariantProps } from "class-variance-authority";

import { CONTROL_HEIGHT } from "./controlSize";

export const FIELD_BASE =
  "flex grow min-w-0 rounded-lg px-3 transition-all duration-200 focus-visible:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50";

export const FIELD_SIZE_TYPO = {
  sm: "text-sm px-2",
  md: "text-sm",
  lg: "text-base px-4",
} as const;

export const FIELD_SIZE_VARIANTS = {
  sm: `${CONTROL_HEIGHT.sm} ${FIELD_SIZE_TYPO.sm}`,
  md: `${CONTROL_HEIGHT.md} ${FIELD_SIZE_TYPO.md}`,
  lg: `${CONTROL_HEIGHT.lg} ${FIELD_SIZE_TYPO.lg}`,
} as const;

export const FIELD_VARIANT_MAP = {
  default: "border border-border bg-input-background",
  filled: "border-0 bg-muted focus-visible:bg-muted/70",
  "filled-error":
    "border-0 bg-destructive/5 shadow-state-error focus-visible:shadow-focus-error",
  "filled-success":
    "border-0 bg-success/5 shadow-state-success focus-visible:shadow-focus-success",
  error:
    "border border-destructive bg-input-background focus-visible:shadow-focus-error",
  success:
    "border border-success bg-input-background focus-visible:shadow-focus-success",
} as const;

export const fieldVariants = cva(FIELD_BASE, {
  variants: {
    size: FIELD_SIZE_VARIANTS,
    variant: FIELD_VARIANT_MAP,
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export type FieldVariantProps = VariantProps<typeof fieldVariants>;
