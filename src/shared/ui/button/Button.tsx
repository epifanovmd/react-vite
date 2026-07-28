import { useMergedRef } from "@mantine/hooks";
import { cn } from "@shared/lib/utils/cn";
import { type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { RippleLayer, useRipple } from "../foundation";
import { buttonVariants } from "./button-variants";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      onPointerDown,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const { buttonRef, ripples, handlePointerDown, removeRipple } = useRipple({
      disabled: isDisabled,
      onPointerDown,
    });
    const mergedRef = useMergedRef(ref, buttonRef);

    return (
      <button
        className={cn("relative", buttonVariants({ variant, size, className }))}
        ref={mergedRef}
        disabled={isDisabled}
        onPointerDown={handlePointerDown}
        {...props}
      >
        <RippleLayer ripples={ripples} onRippleComplete={removeRipple} />
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </span>
        )}
        <span
          className={cn(
            "inline-flex items-center gap-2",
            loading && "invisible",
          )}
        >
          {leftIcon && <span className="inline-flex">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex">{rightIcon}</span>}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
