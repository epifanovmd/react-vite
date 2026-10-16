import { isValid } from "date-fns";
import { useEffect, useRef } from "react";

import { CalendarLayout } from "./CalendarLayout";
import { useCalendarNavigation, useSingleCalendarDays } from "./hooks";
import type { CalendarLocaleProps, DateBoundsProps } from "./types";
import { DATE_LOCALE, resolveWeekStartsOn } from "./utils";

export interface CalendarProps extends CalendarLocaleProps, DateBoundsProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  onDateHover?: (date: Date | undefined) => void;
  /**
   * Стартовый месяц/год (по умолчанию — месяц `selected` или текущий).
   * Дальше видимый месяц следует за сменой `selected`.
   */
  defaultMonth?: number;
  defaultYear?: number;
  className?: string;
}

export const Calendar = ({
  selected,
  onSelect,
  onDateHover,
  defaultMonth,
  defaultYear,
  className,
  locale = DATE_LOCALE,
  weekStartsOn: weekStartsOnProp,
  minDate,
  maxDate,
  disableDate,
}: CalendarProps) => {
  const weekStartsOn = resolveWeekStartsOn(locale, weekStartsOnProp);

  const nav = useCalendarNavigation({
    locale,
    defaultMonth: defaultMonth ?? selected?.getMonth(),
    defaultYear: defaultYear ?? selected?.getFullYear(),
    minDate,
    maxDate,
  });

  const { showDate } = nav;
  const selectedTime =
    selected && isValid(selected) ? selected.getTime() : undefined;
  const prevSelectedTime = useRef(selectedTime);

  useEffect(() => {
    if (prevSelectedTime.current === selectedTime) return;
    prevSelectedTime.current = selectedTime;
    if (selectedTime !== undefined) showDate(new Date(selectedTime));
  }, [selectedTime, showDate]);

  const days = useSingleCalendarDays({
    selected,
    onSelect,
    minDate,
    maxDate,
    disableDate,
  });

  return (
    <CalendarLayout
      nav={nav}
      locale={locale}
      weekStartsOn={weekStartsOn}
      selected={selected}
      className={className}
      getDayFlags={days.getDayFlags}
      isDayDisabled={days.isDisabled}
      onDaySelect={days.handleDaySelect}
      onDateHover={onDateHover}
    />
  );
};
