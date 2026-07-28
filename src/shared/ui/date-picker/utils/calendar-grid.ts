import { getDay, getDaysInMonth, startOfMonth } from "date-fns";

import { makeDate } from "./date-helpers";

export const getDaysInMonthCount = (month: number, year: number): number =>
  getDaysInMonth(makeDate(year, month, 1));

export const getFirstDayOfMonthMondayBased = (
  month: number,
  year: number,
): number => {
  const dayOfWeek = getDay(startOfMonth(makeDate(year, month, 1)));

  return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
};
