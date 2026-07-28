import type { DateRange } from "../types";

export interface DayClassification {
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isSingle: boolean;
}

export interface PreviewClassification {
  active: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
}

export const classifyDay = (
  date: Date,
  today: Date,
  selected?: DateRange,
): DayClassification => {
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const isStart =
    !!selected?.from && date.getTime() === selected.from.getTime();
  const isEnd = !!selected?.to && date.getTime() === selected.to.getTime();
  const isSingle = isStart && isEnd;
  const hasRange = !!selected?.from && !!selected?.to;
  const isInRange = hasRange && date > selected.from! && date < selected.to!;

  return { isToday, isStart, isEnd, isInRange, isSingle };
};

export const classifyPreview = (
  date: Date,
  hoverDate: Date | undefined,
  selected: DateRange | undefined,
  showPreview: boolean,
): PreviewClassification => {
  const active =
    showPreview &&
    !!selected?.from &&
    !selected?.to &&
    !!hoverDate &&
    hoverDate.getTime() !== selected.from.getTime();

  if (!active) {
    return { active: false, isStart: false, isEnd: false, isInRange: false };
  }

  const [from, to] =
    hoverDate! < selected!.from!
      ? [hoverDate!, selected!.from!]
      : [selected!.from!, hoverDate!];

  return {
    active: true,
    isStart: date.getTime() === from.getTime(),
    isEnd: date.getTime() === to.getTime(),
    isInRange: date > from && date < to,
  };
};
