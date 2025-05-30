import { pluralizeDay, pluralizeHour, pluralizeMinute } from "@common";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isToday,
} from "date-fns";

export class DateFormatter {
  diff = (date: Date): string => {
    const now = new Date();

    if (isToday(date)) {
      return `${this.formatTimeDifference(now, date)} назад`;
    } else {
      const daysAgo = differenceInDays(now, date);

      return `${pluralizeDay(daysAgo, true)} назад`;
    }
  };

  private formatTimeDifference = (now: Date, date: Date): string => {
    const minutesAgo = differenceInMinutes(now, date);

    if (minutesAgo < 1) {
      return "меньше минуты";
    } else if (minutesAgo < 60) {
      return pluralizeMinute(minutesAgo, true);
    } else {
      const hoursAgo = differenceInHours(now, date);

      return pluralizeHour(hoursAgo, true);
    }
  };
}
