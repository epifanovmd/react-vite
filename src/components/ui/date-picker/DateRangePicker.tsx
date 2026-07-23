import { cn } from "@utils/cn";
import { type VariantProps } from "class-variance-authority";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Popover, type PopoverContentProps } from "../popover";
import {
  DatePickerTrigger,
  datePickerTriggerVariants,
  TriggerClearButton,
} from "./components";
import { useDateRangePickerValue } from "./hooks";
import { RangeCalendar, type RangeCalendarProps } from "./RangeCalendar";
import type { DateRange } from "./types";

export interface DateRangePickerProps
  extends VariantProps<typeof datePickerTriggerVariants> {
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

    return (
      <Popover>
        <Popover.Trigger asChild>
          <DatePickerTrigger
            ref={ref}
            size={size}
            variant={variant}
            disabled={disabled}
            className={cn(!label && "text-muted-foreground", className)}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
            <span className="flex-1 truncate text-left">
              {label ?? placeholder}
            </span>
            {showClear && (
              <TriggerClearButton onClear={() => onChange?.(undefined)} />
            )}
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
            onSelect={onChange}
            disableDate={disableDate}
            {...calendarProps}
          />
        </Popover.Content>
      </Popover>
    );
  },
);

DateRangePicker.displayName = "DateRangePicker";
