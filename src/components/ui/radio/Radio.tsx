import { cn } from "@utils/cn";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { useRadioGroup } from "./RadioGroupContext";
import { radioDotVariants, radioVariants } from "./radioVariants";

export interface RadioProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "size" | "type" | "value"
    >,
    VariantProps<typeof radioVariants> {
  value: string;
  label?: React.ReactNode;
  description?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      size,
      variant,
      value,
      label,
      description,
      id,
      disabled,
      checked,
      onChange,
      name,
      ...props
    },
    ref,
  ) => {
    const group = useRadioGroup();
    const generatedId = React.useId();
    const radioId = id ?? generatedId;

    const rSize = size ?? group?.size ?? "md";
    const rVariant = variant ?? group?.variant ?? "default";
    const isDisabled = disabled ?? group?.disabled;

    const stateProps = group
      ? {
          name: group.name,
          checked: group.value === value,
          onChange: () => group.onChange(value),
        }
      : { name, checked, onChange };

    return (
      <label
        htmlFor={radioId}
        className={cn(
          "flex items-start gap-2.5",
          isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        )}
      >
        <span className="relative mt-0.5 inline-flex shrink-0">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            value={value}
            disabled={isDisabled}
            className="peer sr-only"
            {...stateProps}
            {...props}
          />
          <span
            className={cn(radioVariants({ size: rSize, variant: rVariant }))}
          />
          <span
            className={radioDotVariants({ size: rSize, variant: rVariant })}
          />
        </span>
        {(label || description) && (
          <span className={cn("flex flex-col", className)}>
            {label && (
              <span className="text-sm font-medium text-foreground leading-snug select-none">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground mt-0.5">
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );
  },
);

Radio.displayName = "Radio";

export { Radio };
