import { LinePath } from "@visx/shape";

import type { ChartPoint, ChartResolvedSeries } from "../chart.types";
import type { ChartModel } from "../hooks/use-chart-model";
import { LINE_WIDTH, POINT_RADIUS, POINT_RING } from "../utils/chart-constants";
import { resolveCurve } from "../utils/curve";

export interface ChartLineSeriesProps<Datum> {
  series: ChartResolvedSeries<Datum>;
  model: ChartModel<Datum>;
  surface: string;
}

export const ChartLineSeries = <Datum,>({
  series,
  model,
  surface,
}: ChartLineSeriesProps<Datum>) => (
  <g>
    <LinePath<ChartPoint<Datum>>
      data={series.points}
      x={point => model.positions[point.index]}
      y={point => model.yScale(point.y1)}
      defined={point => point.value !== null}
      curve={resolveCurve(series.source.curve)}
      stroke={series.color}
      strokeWidth={series.source.strokeWidth ?? LINE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={series.source.dashed ? "6 5" : undefined}
      fill="none"
    />

    {series.source.points &&
      series.points.map(point =>
        point.value === null ? null : (
          <circle
            key={point.index}
            cx={model.positions[point.index]}
            cy={model.yScale(point.y1)}
            r={POINT_RADIUS}
            fill={series.color}
            stroke={surface}
            strokeWidth={POINT_RING}
          />
        ),
      )}
  </g>
);
