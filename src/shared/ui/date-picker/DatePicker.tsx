import { format } from "date-fns";
import * as React from "react";

import { Popover, type PopoverContentProps } from "../popover";
import { Calendar, type CalendarProps } from "./Calendar";
import {
  DatePickerTrigger,
  type DatePickerTriggerVariantProps,
} from "./components";
import { usePickerPopover } from "./hooks";
import type { PickerFieldProps } from "./types";
import { DATE_LOCALE, normalizeDateValue } from "./utils";

export interface DatePickerProps
  extends PickerFieldProps<HTMLButtonElement>, DatePickerTriggerVariantProps {
  /** Дата или ISO-строка; время отбрасывается. */
  value?: Date | string;
  onChange?: (date: Date | undefined) => void;
  contentProps?: Partial<PopoverContentProps>;
  calendarProps?: Omit<CalendarProps, "selected" | "onSelect">;
}

/** Пикер даты с кнопкой-триггером; hover по календарю превьюит дату. */
export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value: rawValue,
      onChange,
      placeholder = "Выберите дату",
      disabled,
      className,
      dateFormat = "d MMMM yyyy",
      clearable = false,
      open: openProp,
      onOpenChange,
      locale = DATE_LOCALE,
      weekStartsOn,
      minDate,
      maxDate,
      disableDate,
      size,
      variant,
      contentProps,
      calendarProps,
      ...triggerProps
    },
    ref,
  ) => {
    const value = normalizeDateValue(rawValue);
    const popover = usePickerPopover({ open: openProp, onOpenChange });

    const shownDate = value ?? popover.hoverDate;
    const displayText = shownDate
      ? format(shownDate, dateFormat, { locale })
      : placeholder;

    const showClear = clearable && !disabled && value !== undefined;

    const handleSelect = React.useCallback(
      (date: Date) => {
        onChange?.(date);
        popover.close();
      },
      [onChange, popover],
    );

    const handleClear = React.useCallback(
      () => onChange?.(undefined),
      [onChange],
    );

    return (
      <Popover open={popover.open} onOpenChange={popover.setOpen}>
        <DatePickerTrigger
          ref={ref}
          {...triggerProps}
          size={size}
          variant={variant}
          disabled={disabled}
          className={className}
          open={popover.open}
          muted={value === undefined}
          showClear={showClear}
          onClear={handleClear}
        >
          {displayText}
        </DatePickerTrigger>

        <Popover.Content size="none" align="start" {...contentProps}>
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
        </Popover.Content>
      </Popover>
    );
  },
);

DatePicker.displayName = "DatePicker";
