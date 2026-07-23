import { cn } from "@utils/cn";
import { useCallback } from "react";

import type { DayState } from "../types";

export interface UseCalendarDaysOptions {
  currentMonth: number;
  currentYear: number;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disableDate?: (date: Date) => boolean;
}

export interface UseCalendarDaysResult {
  handleDaySelect: (day: number) => void;
  isDayDisabled: (day: number) => boolean;
  getDayClassName: (day: number) => DayState | undefined;
}

export const useCalendarDays = ({
  currentMonth,
  currentYear,
  selected,
  onSelect,
  disableDate,
}: UseCalendarDaysOptions): UseCalendarDaysResult => {
  const handleDaySelect = useCallback(
    (day: number) => {
      const date = new Date(currentYear, currentMonth, day);

      if (disableDate?.(date)) return;
      onSelect?.(date);
    },
    [currentYear, currentMonth, onSelect, disableDate],
  );

  const isDayDisabled = useCallback(
    (day: number) =>
      !!disableDate?.(new Date(currentYear, currentMonth, day)),
    [currentYear, currentMonth, disableDate],
  );

  const getDayClassName = useCallback(
    (day: number): DayState | undefined => {
      const today = new Date();
      const isToday =
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();
      const isSelected =
        !!selected &&
        day === selected.getDate() &&
        currentMonth === selected.getMonth() &&
        currentYear === selected.getFullYear();

      return {
        button: cn(
          isToday &&
            !isSelected &&
            "bg-info text-info-foreground hover:bg-info hover:text-info-foreground",
          isSelected &&
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        ),
      };
    },
    [currentMonth, currentYear, selected],
  );

  return { handleDaySelect, isDayDisabled, getDayClassName };
};
