import { type VariantProps } from "class-variance-authority";
import { format, isValid, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { useMemo } from "react";

import { cn } from "../cn";
import { Popover, type PopoverContentProps } from "../popover";
import { Calendar, type CalendarProps } from "./Calendar";
import { DatePickerTrigger } from "./DatePickerTrigger";
import { datePickerTriggerVariants } from "./datePickerVariants";
import { TriggerClearButton } from "./TriggerClearButton";

export interface DatePickerProps
  extends VariantProps<typeof datePickerTriggerVariants> {
  value?: Date | string;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
  clearable?: boolean;
  contentProps?: Partial<PopoverContentProps>;
  calendarProps?: Omit<CalendarProps, "selected" | "onSelect">;
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value: _value,
      onChange,
      placeholder = "Выберите дату",
      disabled,
      className,
      dateFormat = "d MMMM yyyy",
      clearable = false,
      size,
      variant,
      contentProps,
      calendarProps,
    },
    ref,
  ) => {
    const value = useMemo(() => {
      const value = typeof _value === "string" ? parseISO(_value) : _value;

      return isValid(value) ? value : undefined;
    }, [_value]);

    const showClear = clearable && !!value && !disabled;

    return (
      <Popover>
        <Popover.Trigger asChild>
          <DatePickerTrigger
            ref={ref}
            size={size}
            variant={variant}
            disabled={disabled}
            className={cn(!value && "text-muted-foreground", className)}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
            <span className="flex-1 truncate text-left">
              {value ? format(value, dateFormat) : placeholder}
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
          <Calendar selected={value} onSelect={onChange} {...calendarProps} />
        </Popover.Content>
      </Popover>
    );
  },
);

DatePicker.displayName = "DatePicker";
