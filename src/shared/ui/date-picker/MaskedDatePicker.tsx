import { format } from "date-fns";
import * as React from "react";

import { createDateMask, useMaskedInput } from "../masked-input";
import type { PopoverContentProps } from "../popover";
import { Calendar, type CalendarProps } from "./Calendar";
import {
  type DatePickerTriggerVariantProps,
  MaskedPickerField,
} from "./components";
import { usePickerPopover } from "./hooks";
import type { PickerFieldProps } from "./types";
import { DATE_LOCALE, isDayDisabled } from "./utils";

export interface MaskedDatePickerProps
  extends PickerFieldProps<HTMLInputElement>, DatePickerTriggerVariantProps {
  value?: Date;
  /** Вызывается только с полной корректной датой или `undefined` (очистка). */
  onChange?: (date: Date | undefined) => void;
  /** Открывать календарь при фокусе инпута. */
  openOnFocus?: boolean;
  contentProps?: Partial<PopoverContentProps>;
  calendarProps?: Omit<CalendarProps, "selected" | "onSelect">;
}

/**
 * Дата с ручным вводом по маске и календарём. Незавершённый или
 * недопустимый ввод не меняет значение и откатывается при потере фокуса.
 */
export const MaskedDatePicker = React.forwardRef<
  HTMLInputElement,
  MaskedDatePickerProps
>(
  (
    {
      value,
      onChange,
      placeholder = "дд.мм.гггг",
      dateFormat = "dd.MM.yyyy",
      open: openProp,
      onOpenChange,
      locale = DATE_LOCALE,
      weekStartsOn,
      minDate,
      maxDate,
      disableDate,
      calendarProps,
      onBlur,
      ...fieldProps
    },
    ref,
  ) => {
    const popover = usePickerPopover({ open: openProp, onOpenChange });
    const rejectedRef = React.useRef(false);

    const displayValue = value ? format(value, dateFormat) : "";

    const mask = React.useMemo(
      () => createDateMask({ dateFormat, min: minDate, max: maxDate }),
      [dateFormat, minDate, maxDate],
    );

    const masked = useMaskedInput({
      mask,
      value: displayValue,
      onChange: ({ value: text, typedValue, isComplete }) => {
        rejectedRef.current = false;

        if (text === "") {
          onChange?.(undefined);

          return;
        }

        if (!isComplete) return;

        const date = typedValue as Date;

        if (isDayDisabled(date, { minDate, maxDate, disableDate })) {
          rejectedRef.current = true;

          return;
        }

        onChange?.(date);
      },
    });

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (!masked.isComplete || rejectedRef.current) {
        rejectedRef.current = false;
        masked.setValue(displayValue);
      }
      onBlur?.(event);
    };

    const handleSelect = React.useCallback(
      (date: Date) => {
        onChange?.(date);
        popover.close();
      },
      [onChange, popover],
    );

    const previewPlaceholder =
      popover.open && popover.hoverDate
        ? format(popover.hoverDate, dateFormat)
        : placeholder;

    return (
      <MaskedPickerField
        {...fieldProps}
        inputRef={masked.ref}
        forwardedRef={ref}
        defaultValue={displayValue}
        hasValue={masked.value.length > 0}
        placeholder={previewPlaceholder}
        onClear={masked.clear}
        onBlur={handleBlur}
        open={popover.open}
        onOpenChange={popover.setOpen}
      >
        <Calendar
          selected={value}
          onSelect={handleSelect}
          onDateHover={popover.handleDateHover}
          locale={locale}
          weekStartsOn={weekStartsOn}
          minDate={minDate}
          maxDate={maxDate}
          disableDate={disableDate}
          {...calendarProps}
        />
      </MaskedPickerField>
    );
  },
);

MaskedDatePicker.displayName = "MaskedDatePicker";
