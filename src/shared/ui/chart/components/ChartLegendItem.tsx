import { cn } from "@shared/lib/utils/cn";

import type { ChartSeriesType } from "../chart.types";

export interface ChartLegendItemProps {
  label: string;
  color: string;
  type: ChartSeriesType;
  hidden: boolean;
  onToggle?: () => void;
}

/** Метка повторяет марку: штрих для линии, плашка для столбца и области. */
export const ChartLegendItem = ({
  label,
  color,
  type,
  hidden,
  onToggle,
}: ChartLegendItemProps) => {
  const mark = (
    <span
      className={cn(
        "shrink-0",
        type === "line" ? "h-0.5 w-3.5 rounded-full" : "h-2.5 w-2.5 rounded-sm",
      )}
      style={{ background: color }}
    />
  );

  const content = (
    <>
      {mark}
      <span className="truncate">{label}</span>
    </>
  );

  const className = cn(
    "flex items-center gap-1.5 text-xs text-muted-foreground transition-opacity",
    hidden && "opacity-40",
  );

  if (!onToggle) {
    return <li className={className}>{content}</li>;
  }

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={!hidden}
        className={cn(className, "hover:text-foreground")}
      >
        {content}
      </button>
    </li>
  );
};
