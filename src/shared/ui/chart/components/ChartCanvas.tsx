import { GridColumns, GridRows } from "@visx/grid";
import { Group } from "@visx/group";

import type {
  ChartAxisConfig,
  ChartGridMode,
  ChartMargin,
  ChartReferenceLine,
  ChartXValue,
  ChartYAxisConfig,
} from "../chart.types";
import type { ChartModel } from "../hooks/use-chart-model";
import { SURFACE_GAP } from "../utils/chart-constants";
import { ChartAxes } from "./ChartAxes";
import { ChartCrosshair } from "./ChartCrosshair";
import type { ChartOverlayPoint } from "./ChartOverlay";
import { ChartOverlay } from "./ChartOverlay";
import { ChartReferenceLines } from "./ChartReferenceLines";
import { ChartSeriesLayer } from "./ChartSeriesLayer";

export interface ChartCanvasProps<Datum> {
  model: ChartModel<Datum>;
  width: number;
  height: number;
  margin: ChartMargin;
  innerWidth: number;
  innerHeight: number;
  grid: ChartGridMode;
  xAxis: ChartAxisConfig | false;
  yAxis: ChartYAxisConfig | false;
  formatXTick: (value: ChartXValue, index: number) => string;
  referenceLines: ChartReferenceLine[];
  activeIndex: number | null;
  onActive: (index: number | null, point: ChartOverlayPoint | null) => void;
  onSelect?: (index: number) => void;
  crosshair: boolean;
  interactive: boolean;
  surface: string;
  ariaLabel?: string;
}

export const ChartCanvas = <Datum,>({
  model,
  width,
  height,
  margin,
  innerWidth,
  innerHeight,
  grid,
  xAxis,
  yAxis,
  formatXTick,
  referenceLines,
  activeIndex,
  onActive,
  onSelect,
  crosshair,
  interactive,
  surface,
  ariaLabel,
}: ChartCanvasProps<Datum>) => {
  const showRows = grid === "y" || grid === "both";

  // По категориям вертикальная сетка превращается в частокол — только шкалы.
  const showColumns =
    (grid === "x" || grid === "both") && model.xScaleType !== "band";

  const highlight =
    model.hasBars && activeIndex !== null
      ? model.slotStarts[activeIndex]
      : undefined;

  return (
    <svg width={width} height={height} className="select-none overflow-visible">
      <Group left={margin.left} top={margin.top}>
        {showRows && (
          <GridRows
            scale={model.yScale}
            width={innerWidth}
            numTicks={model.yTickCount}
            stroke="var(--border)"
            strokeWidth={1}
          />
        )}

        {showColumns && (
          <GridColumns
            scale={model.xScale}
            height={innerHeight}
            stroke="var(--border)"
            strokeWidth={1}
          />
        )}

        {highlight !== undefined && (
          <rect
            x={highlight - SURFACE_GAP}
            y={0}
            width={model.slotWidth + SURFACE_GAP * 2}
            height={innerHeight}
            fill="var(--muted-foreground)"
            opacity={0.08}
            pointerEvents="none"
          />
        )}

        {model.drawn.map(series => (
          <ChartSeriesLayer
            key={series.key}
            series={series}
            model={model}
            activeIndex={activeIndex}
            surface={surface}
          />
        ))}

        {referenceLines.length > 0 && (
          <ChartReferenceLines
            model={model}
            lines={referenceLines}
            innerWidth={innerWidth}
            innerHeight={innerHeight}
          />
        )}

        {activeIndex !== null && (
          <ChartCrosshair
            model={model}
            activeIndex={activeIndex}
            innerHeight={innerHeight}
            surface={surface}
            showLine={crosshair}
          />
        )}

        {interactive && (
          <ChartOverlay
            width={innerWidth}
            height={innerHeight}
            marginLeft={margin.left}
            marginTop={margin.top}
            positions={model.positions}
            activeIndex={activeIndex}
            onActive={onActive}
            onSelect={onSelect}
            ariaLabel={ariaLabel}
          />
        )}
      </Group>

      <ChartAxes
        model={model}
        innerWidth={innerWidth}
        innerHeight={innerHeight}
        margin={margin}
        xAxis={xAxis}
        yAxis={yAxis}
        formatXTick={formatXTick}
      />
    </svg>
  );
};
