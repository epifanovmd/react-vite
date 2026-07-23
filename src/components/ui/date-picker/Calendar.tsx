import { cn } from "@utils/cn";
import * as React from "react";

import {
  CalendarDayView,
  CalendarHeader,
  CalendarMonthView,
  CalendarYearView,
} from "./components";
import { useCalendar, useCalendarDays } from "./hooks";

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disableDate?: (date: Date) => boolean;
  className?: string;
}

export const Calendar = React.memo(
  ({ selected, onSelect, disableDate, className }: CalendarProps) => {
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
      initialMonth: selected?.getMonth(),
      initialYear: selected?.getFullYear(),
    });

    const { handleDaySelect, isDayDisabled, getDayClassName } =
      useCalendarDays({
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

Calendar.displayName = "Calendar";
