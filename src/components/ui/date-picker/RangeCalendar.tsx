import { cn } from "@utils/cn";
import * as React from "react";

import {
  CalendarDayView,
  CalendarHeader,
  CalendarMonthView,
  CalendarYearView,
} from "./components";
import { useCalendar, useRangeCalendarDays } from "./hooks";
import type { DateRange } from "./types";

export interface RangeCalendarProps {
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  disableDate?: (date: Date) => boolean;
  className?: string;
}

export const RangeCalendar = React.memo(
  ({ selected, onSelect, disableDate, className }: RangeCalendarProps) => {
    const {
      viewMode,
      currentMonth,
      currentYear,
      headerText,
      handlePrevious,
      handleNext,
      handleHeaderClick,
      handleMonthSelect,
      handleYearSelect,
    } = useCalendar({
      initialMonth: selected?.from?.getMonth(),
      initialYear: selected?.from?.getFullYear(),
    });

    const { handleDaySelect, isDayDisabled, getDayClassName } =
      useRangeCalendarDays({
        currentMonth,
        currentYear,
        selected,
        onSelect,
        disableDate,
      });

    return (
      <div className={cn("w-[280px]", className)}>
        <CalendarHeader
          headerText={headerText}
          viewMode={viewMode}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onHeaderClick={handleHeaderClick}
        />
        {viewMode === "day" && (
          <CalendarDayView
            currentMonth={currentMonth}
            currentYear={currentYear}
            onDaySelect={handleDaySelect}
            getDayClassName={getDayClassName}
            isDayDisabled={isDayDisabled}
          />
        )}
        {viewMode === "month" && (
          <CalendarMonthView
            currentMonth={currentMonth}
            onMonthSelect={handleMonthSelect}
          />
        )}
        {viewMode === "year" && (
          <CalendarYearView
            currentYear={currentYear}
            onYearSelect={handleYearSelect}
          />
        )}
      </div>
    );
  },
);

RangeCalendar.displayName = "RangeCalendar";
