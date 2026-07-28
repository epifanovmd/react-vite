import { cn } from "@shared/lib/utils/cn";
import { useCallback } from "react";

import type { DayState } from "../types";
import { isSameDay, makeDate } from "../utils";

export interface UseDayCellInteractionOptions {
  currentMonth: number;
  currentYear: number;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disableDate?: (date: Date) => boolean;
}

export interface UseDayCellInteractionResult {
  handleDaySelect: (day: number) => void;
  isDayDisabled: (day: number) => boolean;
  getDayClassName: (day: number) => DayState | undefined;
}

export const useDayCellInteraction = ({
  currentMonth,
  currentYear,
  selected,
  onSelect,
  disableDate,
}: UseDayCellInteractionOptions): UseDayCellInteractionResult => {
  const handleDaySelect = useCallback(
    (day: number) => {
      const date = makeDate(currentYear, currentMonth, day);

      if (disableDate?.(date)) return;
      onSelect?.(date);
    },
    [currentYear, currentMonth, onSelect, disableDate],
  );

  const isDayDisabled = useCallback(
    (day: number) => !!disableDate?.(makeDate(currentYear, currentMonth, day)),
    [currentYear, currentMonth, disableDate],
  );

  const getDayClassName = useCallback(
    (day: number): DayState | undefined => {
      const today = new Date();
      const current = makeDate(currentYear, currentMonth, day);
      const isToday = isSameDay(today, current);
      const isSelected = !!selected && isSameDay(selected, current);

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
