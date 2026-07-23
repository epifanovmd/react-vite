import { cn } from "@utils/cn";
import { useCallback } from "react";

import type { DateRange, DayState } from "../types";
import { useDateRange } from "./useDateRange";

export interface UseRangeCalendarDaysOptions {
  currentMonth: number;
  currentYear: number;
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  disableDate?: (date: Date) => boolean;
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
}: UseRangeCalendarDaysOptions): UseRangeCalendarDaysResult => {
  const { handleDaySelect: selectRangeDay } = useDateRange(selected);

  const handleDaySelect = useCallback(
    (day: number) => {
      const date = new Date(currentYear, currentMonth, day);

      if (disableDate?.(date)) return;
      selectRangeDay(date, onSelect);
    },
    [currentYear, currentMonth, selectRangeDay, onSelect, disableDate],
  );

  const isDayDisabled = useCallback(
    (day: number) =>
      !!disableDate?.(new Date(currentYear, currentMonth, day)),
    [currentYear, currentMonth, disableDate],
  );

  const getDayClassName = useCallback(
    (day: number): DayState | undefined => {
      const today = new Date();
      const date = new Date(currentYear, currentMonth, day);
      const isToday =
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();
      const isStart =
        !!selected?.from && date.getTime() === selected.from.getTime();
      const isEnd =
        !!selected?.to && date.getTime() === selected.to.getTime();
      const hasRange = !!selected?.from && !!selected?.to;
      const isSingle = isStart && isEnd;
      const isInRange =
        hasRange && date > selected.from! && date < selected.to!;

      return {
        wrapper: cn(
          isInRange && "absolute inset-y-1 left-0 right-0 bg-primary/15",
          hasRange &&
            isStart &&
            !isSingle &&
            "absolute inset-y-1 left-1/2 right-0 bg-primary/15",
          hasRange &&
            isEnd &&
            !isSingle &&
            "absolute inset-y-1 left-0 right-1/2 bg-primary/15",
        ),
        button: cn(
          "rounded-full",
          isToday &&
            !isStart &&
            !isEnd &&
            "bg-info text-info-foreground hover:bg-info hover:text-info-foreground",
          (isStart || isEnd) &&
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        ),
      };
    },
    [currentMonth, currentYear, selected],
  );

  return { handleDaySelect, isDayDisabled, getDayClassName };
};
