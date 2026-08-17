import { useMergedRef } from "@mantine/hooks";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Input } from "../input";
import { createDateMask, useMaskedInput } from "../masked-input";
import { Popover, type PopoverContentProps } from "../popover";
import { Calendar, type CalendarProps } from "./Calendar";
import type { DatePickerTriggerVariantProps } from "./components";

export interface MaskedDatePickerProps extends DatePickerTriggerVariantProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
  clearable?: boolean;
  openOnFocus?: boolean;
  disableDate?: (date: Date) => boolean;
  contentProps?: Partial<PopoverContentProps>;
  calendarProps?: Omit<CalendarProps, "selected" | "onSelect">;
}

export const MaskedDatePicker = React.forwardRef<
  HTMLInputElement,
  MaskedDatePickerProps
>(
  (
    {
      value,
      onChange,
      placeholder = "дд.мм.гггг",
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

    const displayValue = React.useMemo(
      () => (value ? format(value, dateFormat) : ""),
      [value, dateFormat],
    );

    const mask = React.useMemo(
      () => createDateMask({ dateFormat }),
      [dateFormat],
    );

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
      onChange: ({ typedValue }) =>
        onChangeRef.current?.((typedValue as Date | null) ?? undefined),
    });

    const mergedRef = useMergedRef(ref, maskRef);

    const placeholderText = React.useMemo(
      () => (open && hoverDate ? format(hoverDate, dateFormat) : placeholder),
      [open, hoverDate, dateFormat, placeholder],
    );

    const close = React.useCallback(() => {
      setOpen(false);
      setHoverDate(undefined);
    }, []);

    const handleBlur = React.useCallback(() => {
      if (!isComplete) setValue(displayValue);
    }, [isComplete, setValue, displayValue]);

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
          placeholder={placeholderText}
          disabled={disabled}
          className={className}
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
          <Calendar
            selected={value}
            onSelect={date => {
              onChangeRef.current?.(date);
              close();
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

MaskedDatePicker.displayName = "MaskedDatePicker";
