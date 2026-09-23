import {
  curveLinear,
  curveMonotoneX,
  curveNatural,
  curveStep,
  curveStepAfter,
  curveStepBefore,
} from "@visx/curve";

import type { ChartCurveType } from "../chart.types";

const CURVES = {
  linear: curveLinear,
  monotone: curveMonotoneX,
  natural: curveNatural,
  step: curveStep,
  stepAfter: curveStepAfter,
  stepBefore: curveStepBefore,
};

export const resolveCurve = (curve: ChartCurveType = "monotone") =>
  CURVES[curve] ?? curveMonotoneX;
