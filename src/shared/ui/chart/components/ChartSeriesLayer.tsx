import type { ChartResolvedSeries } from "../chart.types";
import type { ChartModel } from "../hooks/use-chart-model";
import { ChartAreaSeries } from "./ChartAreaSeries";
import { ChartBarSeries } from "./ChartBarSeries";
import { ChartLineSeries } from "./ChartLineSeries";

export interface ChartSeriesLayerProps<Datum> {
  series: ChartResolvedSeries<Datum>;
  model: ChartModel<Datum>;
  activeIndex: number | null;
  surface: string;
}

export const ChartSeriesLayer = <Datum,>({
  series,
  model,
  activeIndex,
  surface,
}: ChartSeriesLayerProps<Datum>) => {
  if (series.type === "bar") {
    return (
      <ChartBarSeries series={series} model={model} activeIndex={activeIndex} />
    );
  }

  if (series.type === "area") {
    return <ChartAreaSeries series={series} model={model} />;
  }

  return <ChartLineSeries series={series} model={model} surface={surface} />;
};
