import type { ChartModel } from "../hooks/use-chart-model";
import { POINT_RADIUS, POINT_RING } from "../utils/chart-constants";

export interface ChartCrosshairProps<Datum> {
  model: ChartModel<Datum>;
  activeIndex: number;
  innerHeight: number;
  surface: string;
  showLine: boolean;
}

/**
 * Читатель целится в дату, а не в двухпиксельную линию: вертикаль
 * притягивается к ближайшей позиции данных, а точки подсвечивают значения.
 */
export const ChartCrosshair = <Datum,>({
  model,
  activeIndex,
  innerHeight,
  surface,
  showLine,
}: ChartCrosshairProps<Datum>) => {
  const x = model.positions[activeIndex];

  if (x === undefined) {
    return null;
  }

  return (
    <g pointerEvents="none">
      {showLine && (
        <line
          x1={x}
          x2={x}
          y1={0}
          y2={innerHeight}
          stroke="var(--muted-foreground)"
          strokeWidth={1}
          opacity={0.45}
        />
      )}

      {model.drawn.map(series => {
        const point = series.points[activeIndex];

        if (series.type === "bar" || !point || point.value === null) {
          return null;
        }

        return (
          <circle
            key={series.key}
            cx={x}
            cy={model.yScale(point.y1)}
            r={POINT_RADIUS}
            fill={series.color}
            stroke={surface}
            strokeWidth={POINT_RING}
          />
        );
      })}
    </g>
  );
};
