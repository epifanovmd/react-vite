import { differenceInCalendarDays, format as formatDate } from "date-fns";

import type { ChartXValue } from "../chart.types";

const plain = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });

const compact = new Intl.NumberFormat("ru-RU", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatChartValue = (value: number): string => plain.format(value);

/**
 * Подписи оси округляем до читаемых значений: они несут числа, которые не
 * подписаны прямо на марках.
 */
export const formatAxisValue = (value: number): string =>
  Math.abs(value) >= 10000 ? compact.format(value) : plain.format(value);

export const formatChartX = (value: ChartXValue): string =>
  value instanceof Date ? formatDate(value, "d MMM") : String(value);

/**
 * Шаг подписи времени выбирается по охвату домена: за сутки нужны часы,
 * за год — месяцы, иначе подписи повторяются и перестают что-либо значить.
 */
export const createTimeFormat = (
  domain: [Date, Date],
): ((value: ChartXValue) => string) => {
  const days = Math.abs(differenceInCalendarDays(domain[1], domain[0]));

  const pattern = days <= 2 ? "HH:mm" : days <= 370 ? "d MMM" : "LLL yyyy";

  return value =>
    value instanceof Date ? formatDate(value, pattern) : String(value);
};
