import { cn } from "@shared/lib/utils/cn";
import { Eye, EyeOff, X } from "lucide-react";
import * as React from "react";

import { isInvalidVariant } from "../foundation";
import { Spinner } from "../spinner";
import { type InputVariantProps, inputVariants } from "./input-variants";
import { InputActionButton } from "./InputActionButton";
import { useInput } from "./use-input";

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    InputVariantProps {
  /**
   * Декоративная иконка слева; клики проходят сквозь неё в поле.
   * Не отображается, если передан `leftAddon`: оба слота занимают одно место.
   */
  leftIcon?: React.ReactNode;
  /** Декоративная иконка справа; скрывается, пока показаны действия или загрузка. */
  rightIcon?: React.ReactNode;
  /** Интерактивный слот слева (кнопка, триггер попапа); приоритетнее `leftIcon`. */
  leftAddon?: React.ReactNode;
  /** Интерактивный слот справа; виден всегда, после кнопок действий. */
  rightAddon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  loading?: boolean;
  /** Класс самого элемента input; `className` относится к корневому контейнеру. */
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

const ROOT_CLASS = "relative flex w-full";
const LEFT_ICON_CLASS =
  "pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground";
const LEFT_ADDON_CLASS =
  "absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground";
const ACTIONS_CLASS =
  "absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1";
const RIGHT_ICON_CLASS = "pointer-events-none text-muted-foreground";
const RIGHT_ADDON_CLASS = "flex items-center";
const ACTION_ICON_CLASS = "h-4 w-4";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      size,
      variant,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      clearable,
      onClear,
      loading,
      value,
      defaultValue,
      onChange,
      hasValue: hasValueProp,
      inputClassName,
      clearAriaLabel = "Очистить",
      showPasswordAriaLabel = "Показать пароль",
      hidePasswordAriaLabel = "Скрыть пароль",
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
      isControlled,
      isPassword,
      isPasswordVisible,
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

    const isInteractive = !loading && !disabled;
    const showClearButton =
      Boolean(clearable) &&
      !isPassword &&
      hasValue &&
      isInteractive &&
      !readOnly;
    const showPasswordToggle = isPassword && hasValue && isInteractive;
    const showRightIcon =
      !loading && !showClearButton && !showPasswordToggle && Boolean(rightIcon);
    const showRightAddon = Boolean(rightAddon);
    const showLeftAddon = Boolean(leftAddon);
    const showLeftIcon = !showLeftAddon && Boolean(leftIcon);
    const hasLeftContent = showLeftAddon || showLeftIcon;
    const hasRightContent = Boolean(
      loading ||
      showClearButton ||
      showPasswordToggle ||
      rightIcon ||
      rightAddon,
    );
    const passwordToggleLabel = isPasswordVisible
      ? hidePasswordAriaLabel
      : showPasswordAriaLabel;
    const PasswordToggleIcon = isPasswordVisible ? EyeOff : Eye;
    const valueProps = isControlled ? { value } : { defaultValue };

    return (
      <div
        className={cn(ROOT_CLASS, className)}
        data-has-value={hasValue}
        data-size={size ?? "md"}
        data-slot="input-root"
      >
        {showLeftIcon && (
          <div className={LEFT_ICON_CLASS} data-slot="input-left-icon">
            {leftIcon}
          </div>
        )}
        {showLeftAddon && (
          <div className={LEFT_ADDON_CLASS} data-slot="input-left-addon">
            {leftAddon}
          </div>
        )}
        <input
          ref={inputRef}
          type={inputType}
          className={cn(
            inputVariants({ size, variant }),
            hasLeftContent && "pl-10",
            hasRightContent && "pr-10",
            inputClassName,
          )}
          data-slot="input"
          disabled={disabled}
          readOnly={readOnly}
          aria-busy={ariaBusy ?? (loading || undefined)}
          aria-invalid={ariaInvalid ?? (isInvalidVariant(variant) || undefined)}
          {...valueProps}
          onChange={handleChange}
          {...props}
        />
        {hasRightContent && (
          <div className={ACTIONS_CLASS} data-slot="input-actions">
            {loading && (
              <Spinner size="sm" variant="muted" data-slot="input-loading" />
            )}
            {showPasswordToggle && (
              <InputActionButton
                aria-label={passwordToggleLabel}
                aria-pressed={isPasswordVisible}
                onClick={handlePasswordToggle}
                data-slot="input-password-toggle"
              >
                <PasswordToggleIcon aria-hidden className={ACTION_ICON_CLASS} />
              </InputActionButton>
            )}
            {showClearButton && (
              <InputActionButton
                aria-label={clearAriaLabel}
                onClick={handleClear}
                tabIndex={-1}
                data-slot="input-clear"
              >
                <X aria-hidden className={ACTION_ICON_CLASS} />
              </InputActionButton>
            )}
            {showRightIcon && (
              <div className={RIGHT_ICON_CLASS} data-slot="input-right-icon">
                {rightIcon}
              </div>
            )}
            {showRightAddon && (
              <div className={RIGHT_ADDON_CLASS} data-slot="input-right-addon">
                {rightAddon}
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
