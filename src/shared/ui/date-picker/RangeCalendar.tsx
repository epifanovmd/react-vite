import * as React from "react";

import { CalendarLayout } from "./CalendarLayout";
import { useCalendarNavigation, useRangeCalendarDays } from "./hooks";
import type { DateRange } from "./types";

export interface RangeCalendarProps {
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  disableDate?: (date: Date) => boolean;
  onDateHover?: (date: Date | undefined) => void;
  showRangePreview?: boolean;
  className?: string;
}

export const RangeCalendar = React.memo(
  ({
    selected,
    onSelect,
    disableDate,
    onDateHover,
    showRangePreview = true,
    className,
  }: RangeCalendarProps) => {
    const nav = useCalendarNavigation({
      initialMonth: selected?.from?.getMonth(),
      initialYear: selected?.from?.getFullYear(),
    });

    const [hoveredDate, setHoveredDate] = React.useState<Date | undefined>();

    const handleDateHover = React.useCallback(
      (date: Date | undefined) => {
        setHoveredDate(date);
        onDateHover?.(date);
      },
      [onDateHover],
    );

    const dayInteraction = useRangeCalendarDays({
      currentMonth: nav.currentMonth,
      currentYear: nav.currentYear,
      selected,
      onSelect,
      disableDate,
      hoverDate: hoveredDate,
      showRangePreview,
    });

    return (
      <CalendarLayout
        headerText={nav.headerText}
        viewMode={nav.viewMode}
        currentMonth={nav.currentMonth}
        currentYear={nav.currentYear}
        className={className}
        onPrevious={nav.handlePrevious}
        onNext={nav.handleNext}
        onHeaderClick={nav.handleHeaderClick}
        onMonthSelect={nav.handleMonthSelect}
        onYearSelect={nav.handleYearSelect}
        onDaySelect={dayInteraction.handleDaySelect}
        getDayClassName={dayInteraction.getDayClassName}
        isDayDisabled={dayInteraction.isDayDisabled}
        onDateHover={handleDateHover}
      />
    );
  },
);

RangeCalendar.displayName = "RangeCalendar";
