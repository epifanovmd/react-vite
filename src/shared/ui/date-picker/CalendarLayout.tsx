import { cn } from "@shared/lib/utils/cn";
import * as React from "react";

import {
  CalendarDayView,
  CalendarHeader,
  CalendarMonthView,
  CalendarYearView,
} from "./components";
import type { DayState, ViewMode } from "./types";

export interface CalendarLayoutProps {
  headerText: string;
  viewMode: ViewMode;
  currentMonth: number;
  currentYear: number;
  className?: string;
  onPrevious: () => void;
  onNext: () => void;
  onHeaderClick: () => void;
  onMonthSelect: (month: number) => void;
  onYearSelect: (year: number) => void;
  onDaySelect: (day: number) => void;
  getDayClassName: (day: number) => DayState | undefined;
  isDayDisabled?: (day: number) => boolean;
  onDateHover?: (date: Date | undefined) => void;
}

export const CalendarLayout = React.memo(
  ({
    headerText,
    viewMode,
    currentMonth,
    currentYear,
    className,
    onPrevious,
    onNext,
    onHeaderClick,
    onMonthSelect,
    onYearSelect,
    onDaySelect,
    getDayClassName,
    isDayDisabled,
    onDateHover,
  }: CalendarLayoutProps) => (
    <div className={cn("w-[280px]", className)}>
      <CalendarHeader
        headerText={headerText}
        viewMode={viewMode}
        onPrevious={onPrevious}
        onNext={onNext}
        onHeaderClick={onHeaderClick}
      />
      {viewMode === "day" && (
        <CalendarDayView
          currentMonth={currentMonth}
          currentYear={currentYear}
          onDaySelect={onDaySelect}
          getDayClassName={getDayClassName}
          isDayDisabled={isDayDisabled}
          onDateHover={onDateHover}
        />
      )}
      {viewMode === "month" && (
        <CalendarMonthView
          currentMonth={currentMonth}
          onMonthSelect={onMonthSelect}
        />
      )}
      {viewMode === "year" && (
        <CalendarYearView
          currentYear={currentYear}
          onYearSelect={onYearSelect}
        />
      )}
    </div>
  ),
);

CalendarLayout.displayName = "CalendarLayout";
