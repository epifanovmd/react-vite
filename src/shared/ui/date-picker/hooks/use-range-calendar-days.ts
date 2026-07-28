import { cn } from "@shared/lib/utils/cn";
import { useCallback } from "react";

import type { DateRange, DayState } from "../types";
import { classifyDay, classifyPreview, makeDate } from "../utils";
import { useDateRange } from "./use-date-range";

export interface UseRangeCalendarDaysOptions {
  currentMonth: number;
  currentYear: number;
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  disableDate?: (date: Date) => boolean;
  hoverDate?: Date;
  showRangePreview?: boolean;
}

export interface UseRangeCalendarDaysResult {
  handleDaySelect: (day: number) => void;
  isDayDisabled: (day: number) => boolean;
  getDayClassName: (day: number) => DayState | undefined;
}

export const useRangeCalendarDays = ({
  currentMonth,
  currentYear,
  selected,
  onSelect,
  disableDate,
  hoverDate,
  showRangePreview,
}: UseRangeCalendarDaysOptions): UseRangeCalendarDaysResult => {
  const { handleDaySelect: selectRangeDay } = useDateRange(selected);

  const handleDaySelect = useCallback(
    (day: number) => {
      const date = makeDate(currentYear, currentMonth, day);

      if (disableDate?.(date)) return;
      selectRangeDay(date, onSelect);
    },
    [currentYear, currentMonth, selectRangeDay, onSelect, disableDate],
  );

  const isDayDisabled = useCallback(
    (day: number) => !!disableDate?.(makeDate(currentYear, currentMonth, day)),
    [currentYear, currentMonth, disableDate],
  );

  const getDayClassName = useCallback(
    (day: number): DayState | undefined => {
      const today = new Date();
      const date = makeDate(currentYear, currentMonth, day);

      const { isToday, isStart, isEnd, isInRange, isSingle } = classifyDay(
        date,
        today,
        selected,
      );

      const preview = classifyPreview(
        date,
        hoverDate,
        selected,
        !!showRangePreview,
      );

      return {
        wrapper: cn(
          isInRange && "absolute inset-y-2 left-0 right-0 bg-primary/15",
          !isSingle &&
            isStart &&
            "absolute inset-y-2 left-1/2 right-0 bg-primary/15",
          !isSingle &&
            isEnd &&
            "absolute inset-y-2 left-0 right-1/2 bg-primary/15",
          preview.isInRange && "absolute inset-y-2 left-0 right-0 bg-primary/8",
          preview.isStart && "absolute inset-y-2 left-1/2 right-0 bg-primary/8",
          preview.isEnd && "absolute inset-y-2 left-0 right-1/2 bg-primary/8",
        ),
        button: cn(
          isToday &&
            !isStart &&
            !isEnd &&
            "bg-info text-info-foreground group-hover:bg-info group-hover:text-info-foreground",
          (isStart || isEnd) &&
            "bg-primary text-primary-foreground group-hover:bg-primary group-hover:text-primary-foreground",
        ),
      };
    },
    [currentMonth, currentYear, selected, hoverDate, showRangePreview],
  );

  return { handleDaySelect, isDayDisabled, getDayClassName };
};
