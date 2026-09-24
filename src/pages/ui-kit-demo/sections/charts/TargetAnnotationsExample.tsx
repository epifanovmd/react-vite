import type { ChartBand, ChartReferenceLine, ChartSeries } from "@shared/ui";
import {
  AreaChart,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LineChart,
} from "@shared/ui";
import { format } from "date-fns";
import { FC } from "react";

import { TRAFFIC, type TrafficPoint } from "./chart.data";

const PLAN = 6000;

const RELEASE_DATE = TRAFFIC[20]!.date;

const VISITS_SERIES: ChartSeries<TrafficPoint>[] = [
  { key: "visits", label: "Визиты", value: point => point.visits },
];

const ORDERS_SERIES: ChartSeries<TrafficPoint>[] = [
  { key: "orders", label: "Заказы", value: point => point.orders },
];

const VISITS_LINES: ChartReferenceLine[] = [
  { y: PLAN, label: "План", variant: "destructive", dashed: true },
  { x: RELEASE_DATE, label: "Релиз", variant: "default" },
];

const ORDERS_BANDS: ChartBand[] = [
  { from: 120, to: 180, label: "Целевая зона", variant: "success" },
];

const getDate = (point: TrafficPoint) => point.date;

const formatDay = (value: Date | number | string) =>
  format(value as Date, "d MMMM");

export const TargetAnnotationsExample: FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Аннотации</CardTitle>
      <CardDescription className="text-xs">
        referenceLines — опорные линии по Y (план) и X (событие), bands — полосы
        диапазона (целевая зона). Значения аннотаций попадают в домен оси,
        рисунок обрезается по области графика
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-6 lg:grid-cols-2">
      <LineChart
        data={TRAFFIC}
        series={VISITS_SERIES}
        x={getDate}
        formatX={formatDay}
        referenceLines={VISITS_LINES}
        height={260}
        ariaLabel="Визиты против плана"
      />
      <AreaChart
        data={TRAFFIC}
        series={ORDERS_SERIES}
        x={getDate}
        formatX={formatDay}
        bands={ORDERS_BANDS}
        height={260}
        ariaLabel="Заказы и целевая зона"
      />
    </CardContent>
  </Card>
);
