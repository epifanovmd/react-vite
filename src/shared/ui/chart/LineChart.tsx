import type { LineChartProps } from "./chart.types";
import { ChartLineSeries } from "./components/ChartLineSeries";
import { ChartRoot } from "./components/ChartRoot";
import { useChart } from "./hooks/use-chart";

/** Линии по общей оси X с одним тултипом на позицию. */
export const LineChart = <Datum,>({
  data,
  series,
  x,
  xScale,
  xAxis,
  yAxis,
  margin,
  formatValue,
  formatX,
  curve,
  strokeWidth,
  showPoints,
  ...rootProps
}: LineChartProps<Datum>) => {
  const model = useChart({
    data,
    series,
    x,
    xScale,
    xAxis,
    yAxis,
    margin,
    formatValue,
    formatX,
    zero: false,
  });

  return (
    <ChartRoot model={model} legendShape="line" {...rootProps}>
      {model.visibleSeries.map(item => (
        <ChartLineSeries
          key={item.key}
          series={item}
          curve={curve}
          strokeWidth={strokeWidth}
          showPoints={showPoints}
        />
      ))}
    </ChartRoot>
  );
};
