import { useMergedRef } from "@mantine/hooks";
import { cn } from "@utils/cn";
import { type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import * as React from "react";

import { inputVariants } from "./inputVariants";

const toText = (v: React.InputHTMLAttributes<HTMLInputElement>["value"]) =>
  v == null ? "" : String(v);

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  loading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      size,
      variant,
      leftIcon,
      rightIcon,
      clearable,
      onClear,
      loading,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const isControlled = value !== undefined;

    const innerRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRef(ref, innerRef);

    const [internalValue, setInternalValue] = React.useState(() =>
      toText(value ?? defaultValue),
    );
    const currentValue = isControlled ? toText(value) : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      const input = innerRef.current;

      if (input) {
        const setter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value",
        )?.set;

        setter?.call(input, "");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
      onClear?.();
    };

    const hasValue = currentValue.length > 0;
    const showClearButton = clearable && hasValue && !loading;
    const showPasswordToggle = isPassword && hasValue;

    return (
      <div className={cn("flex w-full relative", className)}>
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={isPassword && !showPassword ? "password" : "text"}
          className={cn(
            inputVariants({ size, variant }),
            leftIcon && "pl-10",
            (rightIcon || showClearButton || showPasswordToggle || loading) &&
              "pr-10",
          )}
          ref={mergedRef}
          {...(isControlled ? { value } : { defaultValue })}
          onChange={handleChange}
          {...props}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {!loading && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          {!loading && showClearButton && !isPassword && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              tabIndex={-1}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {!loading && rightIcon && !showClearButton && !showPasswordToggle && (
            <div className="text-muted-foreground">{rightIcon}</div>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
