import { cn } from "@shared/lib/utils/cn";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { datePickerTriggerVariants } from "./date-picker-variants";

export interface DatePickerTriggerProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof datePickerTriggerVariants> {}

export const DatePickerTrigger = React.forwardRef<
  HTMLButtonElement,
  DatePickerTriggerProps
>(
  (
    { className, size, variant, "aria-invalid": ariaInvalid, ...props },
    ref,
  ) => {
    const isInvalid = variant === "error" || variant === "filled-error";

    return (
      <button
        ref={ref}
        type="button"
        className={cn(datePickerTriggerVariants({ size, variant }), className)}
        aria-invalid={ariaInvalid ?? (isInvalid || undefined)}
        {...props}
      />
    );
  },
);

DatePickerTrigger.displayName = "DatePickerTrigger";
