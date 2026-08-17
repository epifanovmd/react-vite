import { cn } from "@shared/lib/utils/cn";
import * as React from "react";

export interface FormSectionProps extends Omit<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "title"
> {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

/** Accessible group for related form controls. */
export const FormSection = React.forwardRef<
  HTMLFieldSetElement,
  FormSectionProps
>(({ title, description, className, children, ...props }, ref) => (
  <fieldset
    ref={ref}
    className={cn("flex min-w-0 flex-col gap-4", className)}
    {...props}
  >
    {title !== undefined && (
      <legend className="text-sm font-semibold text-foreground">{title}</legend>
    )}
    {description !== undefined && (
      <p className="-mt-2 text-xs text-muted-foreground">{description}</p>
    )}
    {children}
  </fieldset>
));

FormSection.displayName = "FormSection";
