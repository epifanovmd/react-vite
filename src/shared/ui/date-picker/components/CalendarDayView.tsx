import * as React from "react";

import { useCalendarGridCells } from "../hooks";
import type { DayState } from "../types";
import { DAYS_OF_WEEK } from "../utils";
import { CalendarDayCell } from "./CalendarDayCell";

interface CalendarDayViewProps {
  currentMonth: number;
  currentYear: number;
  onDaySelect: (day: number) => void;
  getDayClassName: (day: number) => DayState | undefined;
  isDayDisabled?: (day: number) => boolean;
  onDateHover?: (date: Date | undefined) => void;
}

export const CalendarDayView = React.memo(
  ({
    currentMonth,
    currentYear,
    onDaySelect,
    getDayClassName,
    isDayDisabled,
    onDateHover,
  }: CalendarDayViewProps) => {
    const cells = useCalendarGridCells({ currentMonth, currentYear });

    const handleHover = React.useCallback(
      (day: number | null, disabled: boolean) => {
        onDateHover?.(
          day !== null && !disabled
            ? new Date(currentYear, currentMonth, day)
            : undefined,
        );
      },
      [currentYear, currentMonth, onDateHover],
    );

    return (
      <div className="p-3">
        <div className="grid grid-cols-7 mb-2">
          {DAYS_OF_WEEK.map(day => (
            <div
              key={day}
              className="h-9 text-center text-xs font-medium text-muted-foreground flex items-center justify-center"
            >
              {day}
            </div>
          ))}
        </div>
        <div
          className="grid grid-cols-7"
          onMouseLeave={() => onDateHover?.(undefined)}
        >
          {cells.map((day, i) => {
            const state = day !== null ? getDayClassName(day) : undefined;
            const disabled = day !== null && !!isDayDisabled?.(day);

            return (
              <CalendarDayCell
                key={i}
                day={day}
                wrapperClassName={state?.wrapper}
                buttonClassName={state?.button}
                disabled={disabled}
                onSelect={onDaySelect}
                onHover={handleHover}
              />
            );
          })}
        </div>
      </div>
    );
  },
);

CalendarDayView.displayName = "CalendarDayView";
