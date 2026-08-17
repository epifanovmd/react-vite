import { useMergedRef } from "@mantine/hooks";
import { cn } from "@shared/lib/utils/cn";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Input } from "../input";
import {
  createDateRangeMask,
  formatDateRangeValue,
  parseDateRangeValue,
  useMaskedInput,
} from "../masked-input";
import { Popover, type PopoverContentProps } from "../popover";
import type { DatePickerTriggerVariantProps } from "./components";
import { useDateRangeHoverPreview } from "./hooks";
import { RangeCalendar, type RangeCalendarProps } from "./RangeCalendar";
import type { DateRange } from "./types";

export interface MaskedDateRangePickerProps extends DatePickerTriggerVariantProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
  clearable?: boolean;
  openOnFocus?: boolean;
  disableDate?: (date: Date) => boolean;
  contentProps?: Partial<PopoverContentProps>;
  calendarProps?: Omit<RangeCalendarProps, "selected" | "onSelect">;
}

export const MaskedDateRangePicker = React.forwardRef<
  HTMLInputElement,
  MaskedDateRangePickerProps
>(
  (
    {
      value,
      onChange,
      placeholder = "дд.мм.гггг — дд.мм.гггг",
      disabled,
      className,
      dateFormat = "dd.MM.yyyy",
      clearable = false,
      openOnFocus = false,
      disableDate,
      size,
      variant,
      contentProps,
      calendarProps,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [hoverDate, setHoverDate] = React.useState<Date | undefined>();
    const onChangeRef = React.useRef(onChange);

    onChangeRef.current = onChange;

    const mask = React.useMemo(
      () => createDateRangeMask({ dateFormat }),
      [dateFormat],
    );

    const { previewRange, previewText } = useDateRangeHoverPreview({
      value,
      hoverDate,
      dateFormat,
    });

    const displayValue = React.useMemo(
      () => formatDateRangeValue(previewRange ?? value, { dateFormat }),
      [previewRange, value, dateFormat],
    );

    const rollbackValue = React.useMemo(
      () => formatDateRangeValue(value, { dateFormat }),
      [value, dateFormat],
    );

    const previewRangeRef = React.useRef(previewRange);

    previewRangeRef.current = previewRange;

    const {
      ref: maskRef,
      value: maskedValue,
      isComplete,
      setValue,
      clear,
    } = useMaskedInput({
      mask,
      value: displayValue,
      disabled,
      onChange: ({ value: acceptedValue }) => {
        if (previewRangeRef.current) return;
        const range = parseDateRangeValue(acceptedValue, { dateFormat });

        onChangeRef.current?.(range.from || range.to ? range : undefined);
      },
    });

    const mergedRef = useMergedRef(ref, maskRef);

    const close = React.useCallback(() => {
      setOpen(false);
      setHoverDate(undefined);
    }, []);

    const handleBlur = React.useCallback(() => {
      if (!isComplete) setValue(rollbackValue);
    }, [isComplete, setValue, rollbackValue]);

    const handleClear = React.useCallback(() => {
      clear();
      onChangeRef.current?.(undefined);
    }, [clear]);

    const handleInteractOutside = React.useCallback(
      (event: Event) => {
        if (event.target === maskRef.current) event.preventDefault();
      },
      [maskRef],
    );

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <Input
          ref={mergedRef}
          data-state={open ? "open" : "closed"}
          defaultValue={displayValue}
          hasValue={maskedValue.length > 0}
          placeholder={previewText ?? placeholder}
          disabled={disabled}
          className={cn(previewRange && "text-muted-foreground", className)}
          size={size}
          variant={variant}
          clearable={clearable}
          onClear={handleClear}
          onFocus={() => openOnFocus && setOpen(true)}
          onBlur={handleBlur}
          leftIcon={
            <Popover.Trigger asChild>
              <button
                type="button"
                disabled={disabled}
                tabIndex={-1}
                onMouseDown={e => e.preventDefault()}
                className="pointer-events-auto cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CalendarIcon className="h-4 w-4" />
              </button>
            </Popover.Trigger>
          }
        />

        <Popover.Content
          size="auto"
          align="start"
          className="p-0"
          onOpenAutoFocus={
            openOnFocus ? event => event.preventDefault() : undefined
          }
          onInteractOutside={openOnFocus ? handleInteractOutside : undefined}
          {...contentProps}
        >
          <RangeCalendar
            selected={value}
            onSelect={range => {
              onChangeRef.current?.(range);
              if (range?.from && range?.to) close();
            }}
            disableDate={disableDate}
            onDateHover={setHoverDate}
            {...calendarProps}
          />
        </Popover.Content>
      </Popover>
    );
  },
);

MaskedDateRangePicker.displayName = "MaskedDateRangePicker";
