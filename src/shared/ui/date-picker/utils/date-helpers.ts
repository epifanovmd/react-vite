import { isSameDay as fnsIsSameDay } from "date-fns";

export const makeDate = (year: number, month: number, day: number): Date =>
  new Date(year, month, day);

export const isSameDay = (a: Date, b: Date): boolean => fnsIsSameDay(a, b);

export const getDecadeStart = (year: number): number =>
  Math.floor(year / 12) * 12;
