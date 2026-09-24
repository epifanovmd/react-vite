import { useMergedRef } from "@mantine/hooks";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Input } from "../../input";
import { Popover, type PopoverContentProps } from "../../popover";
import type { DatePickerTriggerVariantProps } from "./date-picker-variants";

export interface MaskedPickerFieldProps extends DatePickerTriggerVariantProps {
  /** Ref на `<input>` от imask (для фокуса и фильтра interact-outside). */
  inputRef: React.RefObject<HTMLInputElement | null>;
  forwardedRef: React.ForwardedRef<HTMLInputElement>;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Стартовое значение в DOM до инициализации imask. */
  defaultValue: string;
  hasValue: boolean;
  clearable?: boolean;
  onClear: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Открывать календарь при фокусе инпута (фокус остаётся в инпуте). */
  openOnFocus?: boolean;
  contentProps?: Partial<PopoverContentProps>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-labelledby"?: string;
  "aria-required"?: boolean;
  children: React.ReactNode;
}

const TRIGGER_CLASS =
  "pointer-events-auto cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

const FOCUSABLE_CELL_SELECTOR = '[data-date][tabindex="0"]';

/** Клик по иконке мышью не уводит фокус из инпута. */
const preventFocusSteal = (event: React.MouseEvent) => event.preventDefault();

/**
 * Поле масочного пикера: `Input` с кнопкой календаря в `leftIcon` и
 * `Popover.Content` с календарём. ArrowDown в инпуте открывает календарь
 * и переводит фокус в сетку дней; Escape возвращает фокус в инпут.
 */
export const MaskedPickerField = ({
  inputRef,
  forwardedRef,
  id,
  name,
  placeholder,
  disabled,
  className,
  defaultValue,
  hasValue,
  clearable,
  onClear,
  open,
  onOpenChange,
  openOnFocus = false,
  contentProps,
  size,
  variant,
  onFocus,
  onBlur,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-labelledby": ariaLabelledBy,
  "aria-required": ariaRequired,
  children,
}: MaskedPickerFieldProps) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const focusCalendarOnOpenRef = React.useRef(false);
  const mergedRef = useMergedRef(forwardedRef, inputRef);

  const focusCalendar = () => {
    contentRef.current
      ?.querySelector<HTMLElement>(FOCUSABLE_CELL_SELECTOR)
      ?.focus();
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();

    if (open) {
      focusCalendar();
    } else {
      focusCalendarOnOpenRef.current = true;
      onOpenChange(true);
    }
  };

  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (openOnFocus) onOpenChange(true);
    onFocus?.(event);
  };

  const handleOpenAutoFocus = (event: Event) => {
    event.preventDefault();
    if (focusCalendarOnOpenRef.current || !openOnFocus) focusCalendar();
    focusCalendarOnOpenRef.current = false;
  };

  const handleCloseAutoFocus = (event: Event) => {
    event.preventDefault();
    inputRef.current?.focus();
  };

  // Клик в инпут при открытом календаре (openOnFocus) не должен его закрывать.
  const handleInteractOutside = (event: Event) => {
    if (event.target === inputRef.current) event.preventDefault();
  };

  const trigger = (
    <Popover.Trigger asChild>
      <button
        type="button"
        disabled={disabled}
        aria-label="Открыть календарь"
        onMouseDown={preventFocusSteal}
        className={TRIGGER_CLASS}
      >
        <CalendarIcon aria-hidden className="h-4 w-4" />
      </button>
    </Popover.Trigger>
  );

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <Input
        ref={mergedRef}
        id={id}
        name={name}
        data-state={open ? "open" : "closed"}
        defaultValue={defaultValue}
        hasValue={hasValue}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        size={size}
        variant={variant}
        clearable={clearable}
        clearAriaLabel="Очистить"
        onClear={onClear}
        onFocus={handleInputFocus}
        onBlur={onBlur}
        onKeyDown={handleInputKeyDown}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        aria-labelledby={ariaLabelledBy}
        aria-required={ariaRequired}
        aria-haspopup="dialog"
        aria-expanded={open}
        leftIcon={trigger}
      />
      <Popover.Content
        ref={contentRef}
        size="none"
        align="start"
        onOpenAutoFocus={handleOpenAutoFocus}
        onCloseAutoFocus={handleCloseAutoFocus}
        onInteractOutside={handleInteractOutside}
        {...contentProps}
      >
        {children}
      </Popover.Content>
    </Popover>
  );
};
