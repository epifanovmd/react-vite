import { cn } from "@shared/lib/utils/cn";
import { type VariantProps } from "class-variance-authority";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Popover, type PopoverContentProps } from "../popover";
import {
  DatePickerTrigger,
  datePickerTriggerVariants,
  TriggerClearButton,
} from "./components";
import { useDateRangeHoverPreview, useDateRangePickerValue } from "./hooks";
import { RangeCalendar, type RangeCalendarProps } from "./RangeCalendar";
import type { DateRange } from "./types";

export interface DateRangePickerProps extends VariantProps<
  typeof datePickerTriggerVariants
> {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
  clearable?: boolean;
  disableDate?: (date: Date) => boolean;
  contentProps?: Partial<PopoverContentProps>;
  calendarProps?: Omit<RangeCalendarProps, "selected" | "onSelect">;
}

export const DateRangePicker = React.forwardRef<
  HTMLButtonElement,
  DateRangePickerProps
>(
  (
    {
      value,
      onChange,
      placeholder = "Выберите период",
      disabled,
      className,
      dateFormat = "d MMM yyyy",
      clearable = false,
      disableDate,
      size,
      variant,
      contentProps,
      calendarProps,
    },
    ref,
  ) => {
    const { showClear, label } = useDateRangePickerValue({
      value,
      dateFormat,
      clearable,
      disabled,
    });
    const [open, setOpen] = React.useState(false);
    const [hoverDate, setHoverDate] = React.useState<Date | undefined>();
    const isOpenRef = React.useRef(false);
    const { previewText } = useDateRangeHoverPreview({
      value,
      hoverDate,
      dateFormat,
    });

    const handleOpenChange = React.useCallback((next: boolean) => {
      isOpenRef.current = next;
      setOpen(next);
      if (!next) setHoverDate(undefined);
    }, []);

    const closePopover = React.useCallback(() => {
      setOpen(false);
      setHoverDate(undefined);
    }, []);

    const handleSelect = React.useCallback(
      (range: DateRange | undefined) => {
        onChange?.(range);
        if (range?.from && range?.to) closePopover();
      },
      [onChange, closePopover],
    );

    const handleDateHover = React.useCallback((date: Date | undefined) => {
      if (!isOpenRef.current && date !== undefined) return;
      setHoverDate(date);
    }, []);

    const handleClear = React.useCallback(() => {
      onChange?.(undefined);
    }, [onChange]);

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger asChild>
          <DatePickerTrigger
            ref={ref}
            size={size}
            variant={variant}
            disabled={disabled}
            className={cn(
              (!label || previewText) && "text-muted-foreground",
              className,
            )}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
            <span className="flex-1 truncate text-left">
              {previewText ?? label ?? placeholder}
            </span>
            {showClear && <TriggerClearButton onClear={handleClear} />}
          </DatePickerTrigger>
        </Popover.Trigger>
        <Popover.Content
          size="auto"
          align="start"
          className="p-0"
          {...contentProps}
        >
          <RangeCalendar
            selected={value}
            onSelect={handleSelect}
            disableDate={disableDate}
            onDateHover={handleDateHover}
            {...calendarProps}
          />
        </Popover.Content>
      </Popover>
    );
  },
);

DateRangePicker.displayName = "DateRangePicker";
