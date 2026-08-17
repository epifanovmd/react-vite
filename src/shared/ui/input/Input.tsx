import { cn } from "@shared/lib/utils/cn";
import { type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, X } from "lucide-react";
import * as React from "react";

import { Spinner } from "../spinner";
import { inputVariants } from "./input-variants";
import { useInput } from "./use-input";

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  loading?: boolean;
  /** Класс корневого контейнера. Для самого input используется inputClassName. */
  inputClassName?: string;
  clearAriaLabel?: string;
  showPasswordAriaLabel?: string;
  hidePasswordAriaLabel?: string;
  /**
   * Переопределяет признак наличия значения для интеграций, которые изменяют
   * DOM напрямую, не вызывая React onChange (например IMask).
   */
  hasValue?: boolean;
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
      hasValue: hasValueProp,
      inputClassName,
      clearAriaLabel = "Clear input",
      showPasswordAriaLabel = "Show password",
      hidePasswordAriaLabel = "Hide password",
      disabled = false,
      readOnly = false,
      "aria-busy": ariaBusy,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const {
      hasValue,
      inputRef,
      inputType,
      isPassword,
      isPasswordVisible,
      handleActionPointerDown,
      handleChange,
      handleClear,
      handlePasswordToggle,
    } = useInput({
      defaultValue,
      disabled,
      forwardedRef: ref,
      hasValue: hasValueProp,
      onChange,
      onClear,
      readOnly,
      type,
      value,
    });

    const showClearButton =
      clearable && hasValue && !loading && !disabled && !readOnly;
    const showPasswordToggle = isPassword && hasValue && !loading && !disabled;
    const showRightIcon =
      !loading && !showClearButton && !showPasswordToggle && rightIcon;
    const hasRightContent =
      loading || showClearButton || showPasswordToggle || rightIcon;
    const isControlled = value !== undefined;
    const isInvalidVariant = variant === "error" || variant === "filled-error";

    return (
      <div
        className={cn("relative flex w-full", className)}
        data-has-value={hasValue}
        data-size={size ?? "md"}
        data-slot="input-root"
      >
        {leftIcon && (
          <div
            className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground"
            data-slot="input-left-icon"
          >
            {leftIcon}
          </div>
        )}
        <input
          ref={inputRef}
          type={inputType}
          className={cn(
            inputVariants({ size, variant }),
            leftIcon && "pl-10",
            hasRightContent && "pr-10",
            inputClassName,
          )}
          data-slot="input"
          disabled={disabled}
          readOnly={readOnly}
          aria-busy={ariaBusy ?? (loading || undefined)}
          aria-invalid={ariaInvalid ?? (isInvalidVariant || undefined)}
          {...(isControlled ? { value } : { defaultValue })}
          onChange={handleChange}
          {...props}
        />
        {hasRightContent && (
          <div
            className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1"
            data-slot="input-actions"
          >
            {loading && (
              <Spinner size="sm" variant="muted" data-slot="input-loading" />
            )}
            {showPasswordToggle && (
              <button
                type="button"
                aria-label={
                  isPasswordVisible
                    ? hidePasswordAriaLabel
                    : showPasswordAriaLabel
                }
                aria-pressed={isPasswordVisible}
                onPointerDown={handleActionPointerDown}
                onClick={handlePasswordToggle}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                tabIndex={-1}
                data-slot="input-password-toggle"
              >
                {isPasswordVisible ? (
                  <EyeOff aria-hidden className="h-4 w-4" />
                ) : (
                  <Eye aria-hidden className="h-4 w-4" />
                )}
              </button>
            )}
            {showClearButton && !isPassword && (
              <button
                type="button"
                aria-label={clearAriaLabel}
                onPointerDown={handleActionPointerDown}
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                tabIndex={-1}
                data-slot="input-clear"
              >
                <X aria-hidden className="h-4 w-4" />
              </button>
            )}
            {showRightIcon && (
              <div
                className="pointer-events-none text-muted-foreground"
                data-slot="input-right-icon"
              >
                {rightIcon}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
