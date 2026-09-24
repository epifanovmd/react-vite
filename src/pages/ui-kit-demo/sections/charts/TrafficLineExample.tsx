import type { ChartCurveType, ChartSeries, SegmentedOption } from "@shared/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LineChart,
  Segmented,
  Switch,
} from "@shared/ui";
import { format } from "date-fns";
import { FC, useMemo, useState } from "react";

import { TRAFFIC, type TrafficPoint } from "./chart.data";

const CURVE_OPTIONS: SegmentedOption<ChartCurveType>[] = [
  { label: "Плавная", value: "monotone" },
  { label: "Ломаная", value: "linear" },
  { label: "Ступени", value: "step" },
];

const formatDay = (value: Date | number | string) =>
  format(value as Date, "d MMMM");

export const TrafficLineExample: FC = () => {
  const [curve, setCurve] = useState<ChartCurveType>("monotone");
  const [showPoints, setShowPoints] = useState(false);
  const [grid, setGrid] = useState(true);

  const series = useMemo<ChartSeries<TrafficPoint>[]>(
    () => [
      { key: "visits", label: "Визиты", value: point => point.visits },
      { key: "signups", label: "Регистрации", value: point => point.signups },
      { key: "orders", label: "Заказы", value: point => point.orders },
    ],
    [],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">LineChart</CardTitle>
        <CardDescription className="text-xs">
          Шкала X подбирается по данным. Клик по легенде скрывает серию, Tab
          ведёт по точкам с клавиатуры, тултип показывает все серии позиции
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Segmented
            size="sm"
            options={CURVE_OPTIONS}
            value={curve}
            onValueChange={setCurve}
          />

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Switch
              size="sm"
              checked={showPoints}
              onCheckedChange={setShowPoints}
            />
            Точки
          </label>

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Switch size="sm" checked={grid} onCheckedChange={setGrid} />
            Сетка
          </label>
        </div>

        <LineChart
          data={TRAFFIC}
          series={series}
          x={point => point.date}
          curve={curve}
          showPoints={showPoints}
          grid={grid ? "y" : "none"}
          height={320}
          formatX={formatDay}
          ariaLabel="Трафик за 30 дней"
        />
      </CardContent>
    </Card>
  );
};
