import { AxisBottom, AxisLeft } from "@visx/axis";

import type {
  ChartAxisConfig,
  ChartMargin,
  ChartXValue,
  ChartYAxisConfig,
} from "../chart.types";
import type { ChartModel } from "../hooks/use-chart-model";
import { formatAxisValue } from "../utils/format";

export interface ChartAxesProps<Datum> {
  model: ChartModel<Datum>;
  innerWidth: number;
  innerHeight: number;
  margin: ChartMargin;
  xAxis: ChartAxisConfig | false;
  yAxis: ChartYAxisConfig | false;
  formatXTick: (value: ChartXValue, index: number) => string;
}

const TICK_LABEL = {
  fill: "var(--muted-foreground)",
  fontSize: 11,
  fontFamily: "inherit",
} as const;

const AXIS_LABEL = {
  fill: "var(--muted-foreground)",
  fontSize: 11,
  fontFamily: "inherit",
  textAnchor: "middle",
} as const;

export const ChartAxes = <Datum,>({
  model,
  innerWidth,
  innerHeight,
  margin,
  xAxis,
  yAxis,
  formatXTick,
}: ChartAxesProps<Datum>) => {
  const showX = xAxis !== false && !xAxis?.hide;
  const showY = yAxis !== false && !yAxis?.hide;

  return (
    <>
      {showY && (
        <AxisLeft
          scale={model.yScale}
          left={margin.left}
          top={margin.top}
          numTicks={yAxis.tickCount ?? model.yTickCount}
          hideAxisLine
          hideTicks
          label={yAxis.label}
          labelProps={AXIS_LABEL}
          tickLabelProps={{ ...TICK_LABEL, textAnchor: "end", dx: -6, dy: 3 }}
          tickFormat={(value, index) =>
            yAxis.tickFormat
              ? yAxis.tickFormat(Number(value), index)
              : formatAxisValue(Number(value))
          }
        />
      )}

      {showX && (
        <AxisBottom
          scale={model.xScale}
          top={margin.top + innerHeight}
          left={margin.left}
          stroke="var(--border)"
          tickStroke="var(--border)"
          tickLength={4}
          numTicks={xAxis.tickCount ?? Math.max(2, Math.floor(innerWidth / 96))}
          tickValues={model.bandTicks}
          label={xAxis.label}
          labelProps={AXIS_LABEL}
          tickLabelProps={{ ...TICK_LABEL, textAnchor: "middle", dy: 2 }}
          tickFormat={(value, index) =>
            model.xScaleType === "band"
              ? formatXTick(model.xValues[Number(value)], Number(value))
              : formatXTick(value as ChartXValue, index)
          }
        />
      )}
    </>
  );
};
