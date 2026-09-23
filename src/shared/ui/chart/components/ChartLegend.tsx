import { cn } from "@shared/lib/utils/cn";

import type { ChartResolvedSeries } from "../chart.types";
import { ChartLegendItem } from "./ChartLegendItem";

export interface ChartLegendProps<Datum> {
  series: ChartResolvedSeries<Datum>[];
  onToggle?: (key: string) => void;
  className?: string;
}

/**
 * При двух и более сериях легенда есть всегда: идентичность не должна
 * держаться на одном цвете.
 */
export const ChartLegend = <Datum,>({
  series,
  onToggle,
  className,
}: ChartLegendProps<Datum>) => (
  <ul
    className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}
  >
    {series.map(item => (
      <ChartLegendItem
        key={item.key}
        label={item.label}
        color={item.color}
        type={item.type}
        hidden={item.hidden}
        onToggle={onToggle && (() => onToggle(item.key))}
      />
    ))}
  </ul>
);
