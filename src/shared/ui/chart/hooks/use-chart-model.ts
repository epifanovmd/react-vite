import { scaleBand, scaleLinear, scaleTime } from "@visx/scale";
import { useMemo } from "react";

import type {
  ChartPoint,
  ChartResolvedSeries,
  ChartSeries,
  ChartSeriesType,
  ChartXScaleType,
  ChartXValue,
  ChartYAxisConfig,
} from "../chart.types";
import { SURFACE_GAP } from "../utils/chart-constants";
import { formatChartValue } from "../utils/format";
import { seriesColor } from "../utils/palette";

type BandScale = ReturnType<typeof scaleBand<number>>;
type TimeScale = ReturnType<typeof scaleTime<number>>;
type LinearScale = ReturnType<typeof scaleLinear<number>>;

export type ChartXScale = BandScale | TimeScale | LinearScale;

export interface ChartModel<Datum> {
  /** Все серии, включая скрытые: легенда показывает и их. */
  series: ChartResolvedSeries<Datum>[];
  /** Видимые серии в порядке отрисовки: столбцы, области, линии. */
  drawn: ChartResolvedSeries<Datum>[];
  xValues: ChartXValue[];
  /** Центр слота каждой точки по X. */
  positions: number[];
  /** Левый край слота: по нему раскладываются столбцы и подсветка. */
  slotStarts: number[];
  slotWidth: number;
  xScale: ChartXScale;
  yScale: LinearScale;
  xScaleType: "band" | "time" | "linear";
  /** Прорежённые индексы подписей band-оси; у остальных шкал — undefined. */
  bandTicks?: number[];
  baseline: number;
  barWidth: number;
  barSlotCount: number;
  barSlotOf: Record<string, number>;
  hasBars: boolean;
  yTickCount: number;
}

export interface UseChartModelOptions<Datum> {
  data: Datum[];
  series: ChartSeries<Datum>[];
  x: (datum: Datum, index: number) => ChartXValue;
  type: ChartSeriesType;
  xScaleType: ChartXScaleType;
  stacked: boolean;
  hiddenKeys: ReadonlySet<string>;
  innerWidth: number;
  innerHeight: number;
  barSize: number;
  barPadding: number;
  yAxis: ChartYAxisConfig | false;
  formatValue?: (value: number) => string;
}

const DRAW_ORDER: Record<ChartSeriesType, number> = {
  bar: 0,
  area: 1,
  line: 2,
};

const toDate = (value: ChartXValue): Date =>
  value instanceof Date ? value : new Date(value);

const toNumber = (value: ChartXValue): number =>
  value instanceof Date ? value.getTime() : Number(value);

const resolveScaleType = (
  requested: ChartXScaleType,
  hasBars: boolean,
  sample: ChartXValue | undefined,
): "band" | "time" | "linear" => {
  if (requested !== "auto") {
    return requested;
  }

  // Столбцу нужен слот конечной ширины, поэтому он всегда тянет за собой band.
  if (hasBars || typeof sample === "string" || sample === undefined) {
    return "band";
  }

  return sample instanceof Date ? "time" : "linear";
};

export const useChartModel = <Datum>({
  data,
  series,
  x,
  type,
  xScaleType,
  stacked,
  hiddenKeys,
  innerWidth,
  innerHeight,
  barSize,
  barPadding,
  yAxis,
  formatValue,
}: UseChartModelOptions<Datum>): ChartModel<Datum> =>
  useMemo(() => {
    const xValues = data.map((datum, index) => x(datum, index));

    const typeOf = (item: ChartSeries<Datum>) => item.type ?? type;

    const visible = series.filter(item => !hiddenKeys.has(item.key));

    const hasBars = visible.some(item => typeOf(item) === "bar");

    const scaleType = resolveScaleType(xScaleType, hasBars, xValues[0]);

    // Скрытая серия выпадает и из стека, иначе соседи «повисают» над пустотой.
    const stackSums = new Map<
      string,
      { positive: number[]; negative: number[] }
    >();

    const resolveStackId = (item: ChartSeries<Datum>) =>
      item.stackId ?? (stacked ? "default" : undefined);

    const buildPoints = (item: ChartSeries<Datum>): ChartPoint<Datum>[] => {
      const stackId = resolveStackId(item);

      const sums = stackId
        ? (stackSums.get(stackId) ??
          stackSums
            .set(stackId, {
              positive: new Array(data.length).fill(0),
              negative: new Array(data.length).fill(0),
            })
            .get(stackId)!)
        : undefined;

      return data.map((datum, index) => {
        const raw = item.value(datum, index);

        const value =
          raw === null || raw === undefined || Number.isNaN(raw) ? null : raw;

        if (value === null) {
          return { index, datum, value: null, y0: 0, y1: 0, stackTop: false };
        }

        if (!sums) {
          return { index, datum, value, y0: 0, y1: value, stackTop: true };
        }

        const bucket = value >= 0 ? sums.positive : sums.negative;

        const y0 = bucket[index];
        const y1 = y0 + value;

        bucket[index] = y1;

        return { index, datum, value, y0, y1, stackTop: true };
      });
    };

    const resolved: ChartResolvedSeries<Datum>[] = series.map(
      (item, index) => ({
        source: item,
        key: item.key,
        label: item.label ?? item.key,
        color: item.color ?? seriesColor(index),
        type: typeOf(item),
        hidden: hiddenKeys.has(item.key),
        format: item.format ?? formatValue ?? formatChartValue,
        points: hiddenKeys.has(item.key) ? [] : buildPoints(item),
      }),
    );

    const drawn = resolved
      .filter(item => !item.hidden)
      .sort((a, b) => DRAW_ORDER[a.type] - DRAW_ORDER[b.type]);

    // Скруглять торец можно только верхнему сегменту стека на этой позиции.
    const stacks = new Map<string, ChartResolvedSeries<Datum>[]>();

    drawn.forEach(item => {
      const stackId = resolveStackId(item.source);

      if (!stackId) {
        return;
      }

      stacks.set(stackId, [...(stacks.get(stackId) ?? []), item]);
    });

    stacks.forEach(members => {
      data.forEach((_, index) => {
        const top = [...members]
          .reverse()
          .find(member => (member.points[index]?.value ?? null) !== null);

        members.forEach(member => {
          const point = member.points[index];

          if (point) {
            point.stackTop = member === top;
          }
        });
      });
    });

    const xScale: ChartXScale =
      scaleType === "band"
        ? scaleBand<number>({
            domain: data.map((_, index) => index),
            range: [0, innerWidth],
            padding: hasBars ? barPadding : 0,
          })
        : scaleType === "time"
          ? scaleTime<number>({
              domain: [
                toDate(xValues[0] ?? 0),
                toDate(xValues[xValues.length - 1] ?? 0),
              ],
              range: [0, innerWidth],
            })
          : scaleLinear<number>({
              domain: [
                toNumber(xValues[0] ?? 0),
                toNumber(xValues[xValues.length - 1] ?? 0),
              ],
              range: [0, innerWidth],
            });

    const slotWidth =
      scaleType === "band"
        ? (xScale as BandScale).bandwidth()
        : data.length > 1
          ? innerWidth / (data.length - 1)
          : innerWidth;

    const slotStarts = data.map((_, index) => {
      if (scaleType === "band") {
        return (xScale as BandScale)(index) ?? 0;
      }

      const value = xValues[index];

      const position =
        scaleType === "time"
          ? (xScale as TimeScale)(toDate(value))
          : (xScale as LinearScale)(toNumber(value));

      return (position ?? 0) - slotWidth / 2;
    });

    const positions = slotStarts.map(start => start + slotWidth / 2);

    const values = drawn.flatMap(item =>
      item.points
        .filter(point => point.value !== null)
        .flatMap(point => [point.y0, point.y1]),
    );

    const zero =
      (yAxis === false ? undefined : yAxis?.zero) ??
      drawn.some(item => item.type !== "line");

    const explicit = yAxis === false ? undefined : yAxis?.domain;

    let min = values.length > 0 ? Math.min(...values) : 0;
    let max = values.length > 0 ? Math.max(...values) : 1;

    if (zero) {
      min = Math.min(min, 0);
      max = Math.max(max, 0);
    }

    if (min === max) {
      min = min === 0 ? 0 : min - Math.abs(min) * 0.1;
      max = max === 0 ? 1 : max + Math.abs(max) * 0.1;
    }

    const yScale = scaleLinear<number>({
      domain: explicit ?? [min, max],
      range: [innerHeight, 0],
      nice: !explicit,
    });

    const [domainMin, domainMax] = yScale.domain();

    const baseline = yScale(Math.min(Math.max(0, domainMin), domainMax));

    const barGroups: string[] = [];

    drawn.forEach(item => {
      if (item.type !== "bar") {
        return;
      }

      const group = resolveStackId(item.source) ?? item.key;

      if (!barGroups.includes(group)) {
        barGroups.push(group);
      }
    });

    const barSlotCount = Math.max(1, barGroups.length);

    const barSlotOf = Object.fromEntries(
      drawn
        .filter(item => item.type === "bar")
        .map(item => [
          item.key,
          barGroups.indexOf(resolveStackId(item.source) ?? item.key),
        ]),
    );

    // Столбцы группы стоят вплотную, разделённые зазором цвета поверхности,
    // а сама группа центрируется в слоте — остаток слота остаётся воздухом.
    const barWidth = Math.max(
      1,
      Math.min(
        barSize,
        (slotWidth - SURFACE_GAP * (barSlotCount - 1)) / barSlotCount,
      ),
    );

    // Подписи прореживаем так, чтобы на каждую оставалось не меньше 72px.
    const tickStep = Math.max(
      1,
      Math.ceil(data.length / Math.max(1, Math.floor(innerWidth / 72))),
    );

    const bandTicks =
      scaleType === "band"
        ? data.map((_, index) => index).filter(index => index % tickStep === 0)
        : undefined;

    return {
      series: resolved,
      drawn,
      xValues,
      positions,
      slotStarts,
      slotWidth,
      xScale,
      yScale,
      xScaleType: scaleType,
      bandTicks,
      baseline,
      barWidth,
      barSlotCount,
      barSlotOf,
      hasBars,
      yTickCount: Math.max(2, Math.min(6, Math.floor(innerHeight / 48))),
    };
  }, [
    data,
    series,
    x,
    type,
    xScaleType,
    stacked,
    hiddenKeys,
    innerWidth,
    innerHeight,
    barSize,
    barPadding,
    yAxis,
    formatValue,
  ]);
