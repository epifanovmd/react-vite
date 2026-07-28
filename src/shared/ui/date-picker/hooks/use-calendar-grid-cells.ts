import { useMemo } from "react";

import { getDaysInMonthCount, getFirstDayOfMonthMondayBased } from "../utils";

export interface UseCalendarGridCellsOptions {
  currentMonth: number;
  currentYear: number;
}

export const useCalendarGridCells = ({
  currentMonth,
  currentYear,
}: UseCalendarGridCellsOptions): (number | null)[] =>
  useMemo(() => {
    const daysInMonth = getDaysInMonthCount(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonthMondayBased(currentMonth, currentYear);
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const cells: (number | null)[] = [];

    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDay + 1;

      cells.push(day >= 1 && day <= daysInMonth ? day : null);
    }

    return cells;
  }, [currentMonth, currentYear]);
