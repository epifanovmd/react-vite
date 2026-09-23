import { Area, LinePath } from "@visx/shape";

import type { ChartPoint, ChartResolvedSeries } from "../chart.types";
import type { ChartModel } from "../hooks/use-chart-model";
import { AREA_FILL_OPACITY, LINE_WIDTH } from "../utils/chart-constants";
import { resolveCurve } from "../utils/curve";

export interface ChartAreaSeriesProps<Datum> {
  series: ChartResolvedSeries<Datum>;
  model: ChartModel<Datum>;
}

export const ChartAreaSeries = <Datum,>({
  series,
  model,
}: ChartAreaSeriesProps<Datum>) => {
  const curve = resolveCurve(series.source.curve);

  const x = (point: ChartPoint<Datum>) => model.positions[point.index];
  const defined = (point: ChartPoint<Datum>) => point.value !== null;

  return (
    <g>
      <Area<ChartPoint<Datum>>
        data={series.points}
        x={x}
        y0={point => model.yScale(point.y0)}
        y1={point => model.yScale(point.y1)}
        defined={defined}
        curve={curve}
        fill={series.color}
        // Заливка — вода, а не плотный блок: верхнюю границу держит линия.
        fillOpacity={series.source.fillOpacity ?? AREA_FILL_OPACITY}
        stroke="none"
      />

      <LinePath<ChartPoint<Datum>>
        data={series.points}
        x={x}
        y={point => model.yScale(point.y1)}
        defined={defined}
        curve={curve}
        stroke={series.color}
        strokeWidth={series.source.strokeWidth ?? LINE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={series.source.dashed ? "6 5" : undefined}
        fill="none"
      />
    </g>
  );
};
