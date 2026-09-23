import { cn } from "@shared/lib/utils/cn";
import { useParentSize } from "@visx/responsive";
import * as React from "react";

import type { ChartMargin, ChartProps, ChartXValue } from "./chart.types";
import { ChartCanvas } from "./components/ChartCanvas";
import { ChartDataTable } from "./components/ChartDataTable";
import { ChartLegend } from "./components/ChartLegend";
import { ChartSkeleton } from "./components/ChartSkeleton";
import { ChartTooltip } from "./components/ChartTooltip";
import { ChartTooltipContent } from "./components/ChartTooltipContent";
import { useChartModel } from "./hooks/use-chart-model";
import { useSeriesVisibility } from "./hooks/use-series-visibility";
import {
  DEFAULT_BAND_PADDING,
  DEFAULT_CHART_HEIGHT,
  DEFAULT_CHART_MARGIN,
  MAX_BAR_SIZE,
} from "./utils/chart-constants";
import { createTimeFormat, formatChartX } from "./utils/format";
import { buildTooltipData } from "./utils/tooltip-data";

interface ActivePoint {
  index: number;
  x: number;
  y: number;
}

export const Chart = <Datum,>({
  data,
  series,
  x,
  type = "line",
  xScale = "auto",
  stacked = false,
  height = DEFAULT_CHART_HEIGHT,
  width: widthProp,
  margin: marginProp,
  grid = "y",
  xAxis,
  yAxis,
  legend = "bottom",
  legendToggle = true,
  tooltip = true,
  renderTooltip,
  crosshair,
  formatValue,
  formatX,
  referenceLines,
  barSize = MAX_BAR_SIZE,
  barPadding = DEFAULT_BAND_PADDING,
  onActiveIndexChange,
  onPointClick,
  loading = false,
  emptyText = "Нет данных",
  dataTable = "sr-only",
  surface = "var(--card)",
  ariaLabel,
  className,
}: ChartProps<Datum>) => {
  const { parentRef, width: measuredWidth } = useParentSize({
    debounceTime: 16,
  });

  const width = widthProp ?? measuredWidth;

  const { hiddenKeys, toggle } = useSeriesVisibility(series);

  const [active, setActive] = React.useState<ActivePoint | null>(null);

  const activeIndexRef = React.useRef<number | null>(null);

  const margin = React.useMemo<ChartMargin>(() => {
    const base = { ...DEFAULT_CHART_MARGIN };

    if (yAxis === false || yAxis?.hide) {
      base.left = 8;
    } else if (yAxis?.size !== undefined) {
      base.left = yAxis.size;
    } else if (yAxis?.label) {
      base.left += 18;
    }

    if (xAxis === false || xAxis?.hide) {
      base.bottom = 8;
    } else if (xAxis?.size !== undefined) {
      base.bottom = xAxis.size;
    } else if (xAxis?.label) {
      base.bottom += 18;
    }

    return { ...base, ...marginProp };
  }, [marginProp, xAxis, yAxis]);

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  const model = useChartModel({
    data,
    series,
    x,
    type,
    xScaleType: xScale,
    stacked,
    hiddenKeys,
    innerWidth,
    innerHeight,
    barSize,
    barPadding,
    yAxis: yAxis ?? {},
    formatValue,
  });

  const formatXTick = React.useMemo(() => {
    const custom = xAxis === false ? undefined : xAxis?.tickFormat;

    if (custom) {
      return custom;
    }

    if (model.xScaleType === "time" && model.xValues.length > 0) {
      const first = model.xValues[0];
      const last = model.xValues[model.xValues.length - 1];

      return createTimeFormat([
        new Date(first as Date),
        new Date(last as Date),
      ]);
    }

    return (value: ChartXValue) => formatChartX(value);
  }, [model.xScaleType, model.xValues, xAxis]);

  const handleActive = React.useCallback(
    (index: number | null, point: { x: number; y: number } | null) => {
      if (activeIndexRef.current !== index) {
        activeIndexRef.current = index;
        onActiveIndexChange?.(index);
      }

      setActive(current => {
        if (index === null || !point) {
          return null;
        }

        return current &&
          current.index === index &&
          current.x === point.x &&
          current.y === point.y
          ? current
          : { index, x: point.x, y: point.y };
      });
    },
    [onActiveIndexChange],
  );

  const handleSelect = React.useCallback(
    (index: number) => {
      const payload = buildTooltipData({ model, data, index, formatX });

      if (payload) {
        onPointClick?.(payload);
      }
    },
    [data, formatX, model, onPointClick],
  );

  const tooltipData =
    tooltip && active
      ? buildTooltipData({ model, data, index: active.index, formatX })
      : null;

  const showLegend = legend !== false && series.length > 1;

  const labels = React.useMemo(
    () =>
      data.map((datum, index) => {
        const value = model.xValues[index];

        return formatX ? formatX(value, datum, index) : formatChartX(value);
      }),
    [data, formatX, model.xValues],
  );

  const isEmpty = data.length === 0 || model.drawn.length === 0;

  const legendNode = showLegend ? (
    <ChartLegend
      series={model.series}
      onToggle={legendToggle ? toggle : undefined}
    />
  ) : null;

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      {legend === "top" && legendNode}

      <div ref={parentRef} className="relative w-full" style={{ height }}>
        {loading && <ChartSkeleton />}

        {!loading && isEmpty && (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {emptyText}
          </div>
        )}

        {!loading && !isEmpty && width > 0 && (
          <ChartCanvas
            model={model}
            width={width}
            height={height}
            margin={margin}
            innerWidth={innerWidth}
            innerHeight={innerHeight}
            grid={grid}
            xAxis={xAxis ?? {}}
            yAxis={yAxis ?? {}}
            formatXTick={formatXTick}
            referenceLines={referenceLines ?? []}
            activeIndex={active?.index ?? null}
            onActive={handleActive}
            onSelect={onPointClick ? handleSelect : undefined}
            crosshair={
              crosshair ?? model.drawn.some(item => item.type !== "bar")
            }
            interactive={tooltip || Boolean(onPointClick)}
            surface={surface}
            ariaLabel={ariaLabel}
          />
        )}

        {tooltipData && active && (
          <ChartTooltip
            x={active.x + margin.left}
            y={Math.min(Math.max(active.y, 0), innerHeight) + margin.top}
            width={width}
            height={height}
          >
            {renderTooltip ? (
              renderTooltip(tooltipData)
            ) : (
              <ChartTooltipContent data={tooltipData} showTotal={stacked} />
            )}
          </ChartTooltip>
        )}
      </div>

      {legend === "bottom" && legendNode}

      {dataTable !== "none" && !isEmpty && (
        <ChartDataTable
          series={model.drawn}
          labels={labels}
          visible={dataTable === "visible"}
          caption={ariaLabel}
        />
      )}
    </div>
  );
};
