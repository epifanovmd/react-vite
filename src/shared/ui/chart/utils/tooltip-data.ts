import type { ChartTooltipData, ChartXValue } from "../chart.types";
import type { ChartModel } from "../hooks/use-chart-model";
import { formatChartX } from "./format";

export interface BuildTooltipDataOptions<Datum> {
  model: ChartModel<Datum>;
  data: Datum[];
  index: number;
  formatX?: (x: ChartXValue, datum: Datum, index: number) => string;
}

/**
 * Один тултип на всю позицию X: курсору не нужно попадать в конкретную
 * линию или заливку, чтобы получить значение.
 */
export const buildTooltipData = <Datum>({
  model,
  data,
  index,
  formatX,
}: BuildTooltipDataOptions<Datum>): ChartTooltipData<Datum> | null => {
  const datum = data[index];

  if (datum === undefined) {
    return null;
  }

  const x = model.xValues[index];

  const entries = model.drawn
    .map(series => {
      const point = series.points[index];

      if (!point || point.value === null) {
        return null;
      }

      return {
        key: series.key,
        label: series.label,
        color: series.color,
        value: point.value,
        formatted: series.format(point.value),
        series: series.source,
      };
    })
    .filter(entry => entry !== null);

  return {
    index,
    datum,
    x,
    label: formatX ? formatX(x, datum, index) : formatChartX(x),
    entries,
    total: entries.reduce((sum, entry) => sum + entry.value, 0),
  };
};
