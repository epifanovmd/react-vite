import * as React from "react";

import { Chart } from "./Chart";
import type { ChartSeries, ChartXValue } from "./chart.types";

export interface SparklineProps<Datum> {
  data: Datum[];
  x: (datum: Datum, index: number) => ChartXValue;
  value: (datum: Datum, index: number) => number | null | undefined;
  /** Подпись серии в тултипе: сам график подписей не несёт. */
  label?: string;
  color?: string;
  area?: boolean;
  height?: number;
  formatValue?: (value: number) => string;
  formatX?: (x: ChartXValue, datum: Datum, index: number) => string;
  ariaLabel?: string;
  className?: string;
}

/** Тренд рядом с числом: без осей, сетки и легенды — только форма и тултип. */
export const Sparkline = <Datum,>({
  data,
  x,
  value,
  label = "Значение",
  color,
  area = false,
  height = 48,
  formatValue,
  formatX,
  ariaLabel,
  className,
}: SparklineProps<Datum>) => {
  const series = React.useMemo<ChartSeries<Datum>[]>(
    () => [
      {
        key: "sparkline",
        label,
        value,
        color,
        type: area ? "area" : "line",
      },
    ],
    [area, color, label, value],
  );

  return (
    <Chart
      data={data}
      series={series}
      x={x}
      height={height}
      margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
      grid="none"
      xAxis={false}
      yAxis={false}
      legend={false}
      crosshair={false}
      formatValue={formatValue}
      formatX={formatX}
      dataTable="none"
      ariaLabel={ariaLabel}
      className={className}
    />
  );
};
