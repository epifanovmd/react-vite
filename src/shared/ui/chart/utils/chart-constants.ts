import type { ChartMargin } from "../chart.types";

export const DEFAULT_CHART_HEIGHT = 280;

export const DEFAULT_CHART_MARGIN: ChartMargin = {
  top: 12,
  right: 16,
  bottom: 28,
  left: 48,
};

/** Столбец не заполняет слот целиком — остаток слота остаётся воздухом. */
export const MAX_BAR_SIZE = 24;

export const DEFAULT_BAND_PADDING = 0.24;

/**
 * Соприкасающиеся марки разделяет не обводка, а зазор цвета поверхности:
 * между сегментами стека и между соседними столбцами он одинаковый.
 */
export const SURFACE_GAP = 2;

/** Кольцо цвета поверхности вокруг точки — чтобы она читалась поверх линии. */
export const POINT_RADIUS = 4;

export const POINT_RING = 2;

export const LINE_WIDTH = 2;

export const AREA_FILL_OPACITY = 0.1;

export const BAR_RADIUS = 4;
