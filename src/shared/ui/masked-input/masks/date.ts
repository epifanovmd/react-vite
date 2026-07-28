import { format as formatDate, isValid, parse as parseDate } from "date-fns";
import type { FactoryOpts } from "imask";

export interface CreateDateMaskOptions {
  dateFormat?: string;
  min?: Date;
  max?: Date;
}

export const createDateMask = ({
  dateFormat = "dd.MM.yyyy",
  min = new Date(1900, 0, 1),
  max = new Date(2100, 11, 31),
}: CreateDateMaskOptions = {}): FactoryOpts =>
  ({
    mask: Date,
    min,
    max,
    format: (date: Date | null) => (date ? formatDate(date, dateFormat) : ""),
    parse: (str: string) => {
      const parsed = parseDate(str, dateFormat, new Date());

      return isValid(parsed) ? parsed : null;
    },
  }) as FactoryOpts;
