import { useMergedRef } from "@mantine/hooks";
import { cn } from "@shared/lib/utils/cn";
import { scrollIntoViewCenter } from "@shared/lib/utils/scroll-into-view-center";
import { type VariantProps } from "class-variance-authority";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import * as React from "react";

import {
  segmentedIndicatorVariants,
  segmentedItemVariants,
  segmentedVariants,
} from "./segmented-variants";

export interface SegmentedOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof segmentedVariants> {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const indicatorTransition = {
  duration: 0.2,
  ease: "easeInOut",
} as const;

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
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const [selectedValue, setSelectedValue] = React.useState(
      controlledValue || defaultValue || options[0]?.value,
    );

    const innerRef = React.useRef<HTMLDivElement>(null);
    const previousValueRef = React.useRef<string | undefined>(undefined);
    const indicatorAnimationsRef = React.useRef<ReturnType<typeof animate>[]>(
      [],
    );
    const indicatorX = useMotionValue(0);
    const indicatorY = useMotionValue(0);
    const indicatorWidth = useMotionValue(0);
    const indicatorHeight = useMotionValue(0);
    const shouldReduceMotion = useReducedMotion();

    const value =
      controlledValue !== undefined ? controlledValue : selectedValue;

    const setRef = useMergedRef(ref, innerRef);

    const stopIndicatorAnimations = React.useCallback(() => {
      indicatorAnimationsRef.current.forEach(animation => animation.stop());
      indicatorAnimationsRef.current = [];
    }, []);

    const updateIndicator = React.useCallback(
      (animated: boolean) => {
        const activeItem = innerRef.current?.querySelector<HTMLElement>(
          '[data-active="true"]',
        );

        if (!activeItem) return;

        const nextRect = {
          x: activeItem.offsetLeft,
          y: activeItem.offsetTop,
          width: activeItem.offsetWidth,
          height: activeItem.offsetHeight,
        };

        stopIndicatorAnimations();

        if (animated && !shouldReduceMotion) {
          indicatorAnimationsRef.current = [
            animate(indicatorX, nextRect.x, indicatorTransition),
            animate(indicatorY, nextRect.y, indicatorTransition),
            animate(indicatorWidth, nextRect.width, indicatorTransition),
            animate(indicatorHeight, nextRect.height, indicatorTransition),
          ];

          return;
        }

        indicatorX.set(nextRect.x);
        indicatorY.set(nextRect.y);
        indicatorWidth.set(nextRect.width);
        indicatorHeight.set(nextRect.height);
      },
      [
        indicatorHeight,
        indicatorWidth,
        indicatorX,
        indicatorY,
        shouldReduceMotion,
        stopIndicatorAnimations,
      ],
    );

    React.useLayoutEffect(() => {
      const shouldAnimate =
        previousValueRef.current !== undefined &&
        previousValueRef.current !== value;

      updateIndicator(shouldAnimate);
      previousValueRef.current = value;
    }, [options.length, updateIndicator, value]);

    React.useLayoutEffect(() => {
      const root = innerRef.current;

      if (!root || typeof ResizeObserver === "undefined") return;

      const resizeObserver = new ResizeObserver(() => updateIndicator(false));

      resizeObserver.observe(root);
      root
        .querySelectorAll<HTMLElement>("[data-segmented-item]")
        .forEach(item => resizeObserver.observe(item));

      return () => resizeObserver.disconnect();
    }, [options.length, updateIndicator]);

    React.useEffect(
      () => () => {
        stopIndicatorAnimations();
      },
      [stopIndicatorAnimations],
    );

    React.useEffect(() => {
      scrollIntoViewCenter(
        innerRef.current?.querySelector<HTMLElement>('[data-active="true"]'),
      );
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
        className={cn(
          "relative",
          segmentedVariants({ variant, size }),
          className,
        )}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {value !== undefined && (
          <motion.div
            aria-hidden
            data-slot="segmented-indicator"
            className={cn(
              "absolute top-0 left-0 z-0",
              segmentedIndicatorVariants({ variant, size }),
            )}
            style={{
              x: indicatorX,
              y: indicatorY,
              width: indicatorWidth,
              height: indicatorHeight,
            }}
          />
        )}
        {options.map(option => {
          const isSelected = value === option.value;
          const isDisabled = disabled || option.disabled;

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
              data-segmented-item
            >
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
