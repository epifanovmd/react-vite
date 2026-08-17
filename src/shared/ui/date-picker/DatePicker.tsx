import { cn } from "@shared/lib/utils/cn";
import { type VariantProps } from "class-variance-authority";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Popover, type PopoverContentProps } from "../popover";
import { Calendar, type CalendarProps } from "./Calendar";
import {
  DatePickerTrigger,
  datePickerTriggerVariants,
  TriggerClearButton,
} from "./components";
import { useDatePickerValue } from "./hooks";

export interface DatePickerProps extends VariantProps<
  typeof datePickerTriggerVariants
> {
  id?: string;
  name?: string;
  value?: Date | string;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
  clearable?: boolean;
  disableDate?: (date: Date) => boolean;
  contentProps?: Partial<PopoverContentProps>;
  calendarProps?: Omit<CalendarProps, "selected" | "onSelect">;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-labelledby"?: string;
  "aria-required"?: boolean;
}

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
      disableDate,
      size,
      variant,
      contentProps,
      calendarProps,
      id,
      name,
      onBlur,
      onFocus,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-labelledby": ariaLabelledBy,
      "aria-required": ariaRequired,
    },
    ref,
  ) => {
    const { value, showClear } = useDatePickerValue({
      value: rawValue,
      clearable,
      disabled,
    });
    const [open, setOpen] = React.useState(false);
    const [hoverDate, setHoverDate] = React.useState<Date | undefined>();
    const isOpenRef = React.useRef(false);

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
      (date: Date | undefined) => {
        onChange?.(date);
        closePopover();
      },
      [onChange, closePopover],
    );

    const handleDateHover = React.useCallback((date: Date | undefined) => {
      if (!isOpenRef.current && date !== undefined) return;
      setHoverDate(date);
    }, []);

    const displayText = React.useMemo(() => {
      if (value) return format(value, dateFormat);
      if (hoverDate) return format(hoverDate, dateFormat);

      return placeholder;
    }, [value, hoverDate, dateFormat, placeholder]);

    const handleClear = React.useCallback(() => {
      onChange?.(undefined);
    }, [onChange]);

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger asChild>
          <DatePickerTrigger
            ref={ref}
            id={id}
            name={name}
            size={size}
            variant={variant}
            disabled={disabled}
            className={cn(!value && "text-muted-foreground", className)}
            onBlur={onBlur}
            onFocus={onFocus}
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid}
            aria-labelledby={ariaLabelledBy}
            aria-required={ariaRequired}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
            <span className="flex-1 truncate text-left">{displayText}</span>
            {showClear && <TriggerClearButton onClear={handleClear} />}
          </DatePickerTrigger>
        </Popover.Trigger>

        <Popover.Content
          size="auto"
          align="start"
          className="p-0"
          {...contentProps}
        >
          <Calendar
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

DatePicker.displayName = "DatePicker";
