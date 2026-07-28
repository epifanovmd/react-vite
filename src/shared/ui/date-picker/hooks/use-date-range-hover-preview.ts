import { format as formatDate } from "date-fns";
import { useMemo } from "react";

import type { DateRange } from "../types";

export interface UseDateRangeHoverPreviewOptions {
  value?: DateRange;
  hoverDate?: Date;
  /** date-fns формат, в котором строится текст плейсхолдера */
  dateFormat: string;
  separator?: string;
}

export interface UseDateRangeHoverPreviewResult {
  /** Диапазон превью с датами в хронологическом порядке (from раньше to); задан только пока выбрана лишь "от" и идёт наведение */
  previewRange: DateRange | undefined;
  /** Готовый текст плейсхолдера под previewRange/наведённую дату; undefined, если превью показывать не нужно */
  previewText: string | undefined;
}

export const useDateRangeHoverPreview = ({
  value,
  hoverDate,
  dateFormat,
  separator = " — ",
}: UseDateRangeHoverPreviewOptions): UseDateRangeHoverPreviewResult =>
  useMemo(() => {
    if (!hoverDate) return { previewRange: undefined, previewText: undefined };

    if (!value?.from) {
      return {
        previewRange: undefined,
        previewText: formatDate(hoverDate, dateFormat),
      };
    }

    if (value.to) return { previewRange: undefined, previewText: undefined };

    const [from, to] =
      hoverDate < value.from
        ? [hoverDate, value.from]
        : [value.from, hoverDate];
    const previewRange: DateRange = { from, to };
    const previewText = `${formatDate(from, dateFormat)}${separator}${formatDate(to, dateFormat)}`;

    return { previewRange, previewText };
  }, [value?.from, value?.to, hoverDate, dateFormat, separator]);
