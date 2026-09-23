import type { ReactNode } from "react";

/** Тип отрисовки серии; в одном графике типы можно смешивать. */
export type ChartSeriesType = "line" | "area" | "bar";

export type ChartCurveType =
  "linear" | "monotone" | "natural" | "step" | "stepAfter" | "stepBefore";

export type ChartXValue = Date | number | string;

/**
 * `auto` — band, если есть столбцы; иначе time для дат, linear для чисел
 * и band для строковых категорий.
 */
export type ChartXScaleType = "auto" | "band" | "time" | "linear";

export type ChartGridMode = "none" | "x" | "y" | "both";

export type ChartLegendPlacement = "top" | "bottom";

/** Таблица с теми же значениями: `sr-only` — только для скринридеров. */
export type ChartDataTableMode = "sr-only" | "visible" | "none";

export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ChartSeries<Datum> {
  /** Идентификатор серии: ключ React, легенда, тултип, видимость. */
  key: string;
  label?: string;
  type?: ChartSeriesType;
  value: (datum: Datum, index: number) => number | null | undefined;
  /** CSS-цвет. По умолчанию — слот палитры по порядку объявления серии. */
  color?: string;
  curve?: ChartCurveType;
  /** Серии с одинаковым `stackId` складываются друг на друга. */
  stackId?: string;
  /** Непрозрачность заливки area: по умолчанию лёгкая вода, а не плотный блок. */
  fillOpacity?: number;
  strokeWidth?: number;
  dashed?: boolean;
  /** Показывать точки всегда, а не только под курсором. */
  points?: boolean;
  format?: (value: number) => string;
  /** Скрыта на первом рендере; легенда может вернуть её обратно. */
  hidden?: boolean;
}

export interface ChartAxisConfig {
  hide?: boolean;
  label?: string;
  tickCount?: number;
  tickFormat?: (value: ChartXValue, index: number) => string;
  /** Место под ось: высота для X, ширина для Y. */
  size?: number;
}

export interface ChartYAxisConfig extends Omit<ChartAxisConfig, "tickFormat"> {
  tickFormat?: (value: number, index: number) => string;
  domain?: [number, number];
  /** Включать 0 в домен; по умолчанию да, если есть столбцы или области. */
  zero?: boolean;
}

export interface ChartReferenceLine {
  /** Горизонтальная линия по значению оси Y. */
  y?: number;
  /** Вертикальная линия по позиции точки в данных. */
  xIndex?: number;
  label?: string;
  color?: string;
  dashed?: boolean;
}

export interface ChartPoint<Datum> {
  index: number;
  datum: Datum;
  /** `null` — пропуск: линия рвётся, столбец не рисуется. */
  value: number | null;
  /** Низ сегмента в единицах оси Y (для стека — накопленная сумма). */
  y0: number;
  /** Верх сегмента в единицах оси Y. */
  y1: number;
  /** Верхний сегмент стека на этой позиции — только ему скругляем торец. */
  stackTop: boolean;
}

export interface ChartResolvedSeries<Datum> {
  source: ChartSeries<Datum>;
  key: string;
  label: string;
  color: string;
  type: ChartSeriesType;
  hidden: boolean;
  points: ChartPoint<Datum>[];
  format: (value: number) => string;
}

export interface ChartTooltipEntry<Datum> {
  key: string;
  label: string;
  color: string;
  value: number;
  formatted: string;
  series: ChartSeries<Datum>;
}

export interface ChartTooltipData<Datum> {
  index: number;
  datum: Datum;
  x: ChartXValue;
  label: string;
  entries: ChartTooltipEntry<Datum>[];
  /** Сумма видимых значений — осмысленна для стека. */
  total: number;
}

export interface ChartProps<Datum> {
  data: Datum[];
  series: ChartSeries<Datum>[];
  x: (datum: Datum, index: number) => ChartXValue;
  /** Тип серий по умолчанию, если он не задан в самой серии. */
  type?: ChartSeriesType;
  xScale?: ChartXScaleType;
  /** Сложить все серии в один стек, не проставляя `stackId` каждой. */
  stacked?: boolean;
  height?: number;
  /** Фиксированная ширина; по умолчанию график меряет контейнер сам. */
  width?: number;
  margin?: Partial<ChartMargin>;
  grid?: ChartGridMode;
  xAxis?: ChartAxisConfig | false;
  yAxis?: ChartYAxisConfig | false;
  legend?: ChartLegendPlacement | false;
  /** Клик по легенде скрывает и возвращает серию. */
  legendToggle?: boolean;
  tooltip?: boolean;
  renderTooltip?: (data: ChartTooltipData<Datum>) => ReactNode;
  crosshair?: boolean;
  formatValue?: (value: number) => string;
  formatX?: (x: ChartXValue, datum: Datum, index: number) => string;
  referenceLines?: ChartReferenceLine[];
  /** Предельная толщина столбца; остаток слота остаётся воздухом. */
  barSize?: number;
  barPadding?: number;
  onActiveIndexChange?: (index: number | null) => void;
  onPointClick?: (data: ChartTooltipData<Datum>) => void;
  loading?: boolean;
  emptyText?: ReactNode;
  dataTable?: ChartDataTableMode;
  /** Цвет поверхности под графиком: им рисуются зазоры и кольца точек. */
  surface?: string;
  ariaLabel?: string;
  className?: string;
}
