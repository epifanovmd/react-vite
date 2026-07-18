import { cn } from "@utils/cn";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { datePickerTriggerVariants } from "./datePickerVariants";

export interface DatePickerTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof datePickerTriggerVariants> {}

export const DatePickerTrigger = React.forwardRef<
  HTMLButtonElement,
  DatePickerTriggerProps
>(({ className, size, variant, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(datePickerTriggerVariants({ size, variant }), className)}
    {...props}
  />
));

DatePickerTrigger.displayName = "DatePickerTrigger";
