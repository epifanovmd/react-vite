import * as React from "react";

import { CalendarLayout } from "./CalendarLayout";
import { useCalendarNavigation, useDayCellInteraction } from "./hooks";

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disableDate?: (date: Date) => boolean;
  onDateHover?: (date: Date | undefined) => void;
  className?: string;
}

export const Calendar = React.memo(
  ({
    selected,
    onSelect,
    disableDate,
    onDateHover,
    className,
  }: CalendarProps) => {
    const nav = useCalendarNavigation({
      initialMonth: selected?.getMonth(),
      initialYear: selected?.getFullYear(),
    });

    const dayInteraction = useDayCellInteraction({
      currentMonth: nav.currentMonth,
      currentYear: nav.currentYear,
      selected,
      onSelect,
      disableDate,
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
        onDateHover={onDateHover}
      />
    );
  },
);

Calendar.displayName = "Calendar";
