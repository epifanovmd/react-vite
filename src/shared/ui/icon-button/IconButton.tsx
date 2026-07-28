import { useMergedRef } from "@mantine/hooks";
import { cn } from "@shared/lib/utils/cn";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { RippleLayer, useRipple } from "../foundation";
import { iconButtonVariants } from "./icon-button-variants";

export interface IconButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, variant, size, children, disabled, onPointerDown, ...props },
    ref,
  ) => {
    const { buttonRef, ripples, handlePointerDown, removeRipple } = useRipple({
      disabled,
      onPointerDown,
    });
    const mergedRef = useMergedRef(ref, buttonRef);

    return (
      <button
        className={cn(
          "relative",
          iconButtonVariants({ variant, size, className }),
        )}
        ref={mergedRef}
        disabled={disabled}
        onPointerDown={handlePointerDown}
        {...props}
      >
        <RippleLayer ripples={ripples} onRippleComplete={removeRipple} />
        {children}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";

export { IconButton };
