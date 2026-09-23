import { BarRounded } from "@visx/shape";

import type { ChartResolvedSeries } from "../chart.types";
import type { ChartModel } from "../hooks/use-chart-model";
import { BAR_RADIUS, SURFACE_GAP } from "../utils/chart-constants";

export interface ChartBarSeriesProps<Datum> {
  series: ChartResolvedSeries<Datum>;
  model: ChartModel<Datum>;
  activeIndex: number | null;
}

export const ChartBarSeries = <Datum,>({
  series,
  model,
  activeIndex,
}: ChartBarSeriesProps<Datum>) => {
  const slot = model.barSlotOf[series.key] ?? 0;

  const groupWidth =
    model.barWidth * model.barSlotCount +
    SURFACE_GAP * (model.barSlotCount - 1);

  const groupStart = (model.slotWidth - groupWidth) / 2;

  return (
    <g>
      {series.points.map(point => {
        if (point.value === null) {
          return null;
        }

        const negative = point.value < 0;
        const top = model.yScale(Math.max(point.y0, point.y1));
        const bottom = model.yScale(Math.min(point.y0, point.y1));

        // Сегменты стека разделяет зазор цвета поверхности, а не обводка.
        const gap = point.y0 === 0 ? 0 : SURFACE_GAP;

        const height = Math.max(0, bottom - top - gap);

        const x =
          model.slotStarts[point.index] +
          groupStart +
          slot * (model.barWidth + SURFACE_GAP);

        return (
          <BarRounded
            key={point.index}
            x={x}
            y={negative ? top + gap : top}
            width={model.barWidth}
            height={height}
            radius={BAR_RADIUS}
            // Скругляется только торец данных; у базовой линии столбец прямой.
            top={!negative && point.stackTop}
            bottom={negative && point.stackTop}
            fill={series.color}
            opacity={
              activeIndex === null || activeIndex === point.index ? 1 : 0.5
            }
            className="transition-opacity duration-150"
          />
        );
      })}
    </g>
  );
};
