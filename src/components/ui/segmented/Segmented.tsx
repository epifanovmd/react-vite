import { type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "../cn";
import {
  segmentedIndicatorVariants,
  segmentedItemVariants,
  segmentedVariants,
} from "./segmentedVariants";

export interface SegmentedOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof segmentedVariants> {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const Segmented = React.forwardRef<HTMLDivElement, SegmentedProps>(
  (
    {
      className,
      variant,
      size,
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [selectedValue, setSelectedValue] = React.useState(
      controlledValue || defaultValue || options[0]?.value,
    );

    const layoutId = React.useId();
    const innerRef = React.useRef<HTMLDivElement>(null);

    const value =
      controlledValue !== undefined ? controlledValue : selectedValue;

    const setRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    // Smoothly center the active segment when the row overflows horizontally.
    React.useEffect(() => {
      const active = innerRef.current?.querySelector<HTMLElement>(
        '[data-active="true"]',
      );

      active?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }, [value]);

    const handleSelect = (optionValue: string, disabled?: boolean) => {
      if (disabled) return;

      if (controlledValue === undefined) {
        setSelectedValue(optionValue);
      }
      onChange?.(optionValue);
    };

    return (
      <div
        ref={setRef}
        className={cn(segmentedVariants({ variant, size }), className)}
        {...props}
      >
        {options.map(option => {
          const isSelected = value === option.value;
          const isDisabled = option.disabled;

          return (
            <button
              key={option.value}
              className={cn(
                segmentedItemVariants({ size }),
                isSelected
                  ? variant === "primary"
                    ? "text-primary-foreground"
                    : variant === "secondary"
                      ? "text-secondary-foreground"
                      : "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
                isDisabled && "opacity-50 cursor-not-allowed",
              )}
              onClick={() => handleSelect(option.value, option.disabled)}
              disabled={isDisabled}
              type="button"
              data-active={isSelected}
            >
              {isSelected && (
                <motion.div
                  layoutId={`${layoutId}-indicator`}
                  className={cn(
                    "absolute inset-0 z-0",
                    segmentedIndicatorVariants({ variant, size }),
                  )}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                />
              )}
              <span className="relative z-10 inline-flex items-center">
                {option.icon && (
                  <span className="mr-1.5 inline-flex items-center">
                    {option.icon}
                  </span>
                )}
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  },
);

Segmented.displayName = "Segmented";

export { Segmented };
