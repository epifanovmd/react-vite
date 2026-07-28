import { cn } from "@shared/lib/utils/cn";
import * as React from "react";

interface CalendarDayCellProps {
  day: number | null;
  wrapperClassName?: string;
  buttonClassName?: string;
  disabled: boolean;
  onSelect: (day: number) => void;
  onHover: (day: number | null, disabled: boolean) => void;
}

export const CalendarDayCell = React.memo(
  ({
    day,
    wrapperClassName,
    buttonClassName,
    disabled,
    onSelect,
    onHover,
  }: CalendarDayCellProps) => (
    <div
      className="relative h-9 flex items-center justify-center"
      onMouseEnter={() => onHover(day, disabled)}
    >
      {wrapperClassName && <div className={wrapperClassName} />}
      {day !== null && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelect(day)}
          className={cn(
            "group relative z-10 h-full w-full text-sm",
            "inline-flex items-center justify-center",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
          )}
        >
          <span
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-full",
              disabled
                ? "opacity-40"
                : "group-hover:bg-accent group-hover:text-accent-foreground",
              buttonClassName,
            )}
          >
            {day}
          </span>
        </button>
      )}
    </div>
  ),
);

CalendarDayCell.displayName = "CalendarDayCell";
