import type { ChartSeries, ChartSeriesType } from "@shared/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Chart,
  Segmented,
  Switch,
} from "@shared/ui";
import { format } from "date-fns";
import { FC, useMemo, useState } from "react";

import { TRAFFIC, type TrafficPoint } from "./chart.data";

const TYPE_OPTIONS = [
  { label: "Линия", value: "line" },
  { label: "Область", value: "area" },
  { label: "Столбцы", value: "bar" },
];

export const TrafficChartExample: FC = () => {
  const [type, setType] = useState<ChartSeriesType>("area");
  const [stacked, setStacked] = useState(false);
  const [grid, setGrid] = useState(true);
  const [table, setTable] = useState(false);

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
        <CardTitle className="text-base">Chart</CardTitle>
        <CardDescription className="text-xs">
          Линии, области и столбцы — один компонент: тип задаёт серия, шкала X
          подбирается по данным. Клик по легенде скрывает серию, стрелки ← →
          ведут по точкам с клавиатуры
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Segmented
            size="sm"
            options={TYPE_OPTIONS}
            value={type}
            onChange={value => setType(value as ChartSeriesType)}
          />

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Switch
              size="sm"
              checked={stacked}
              onCheckedChange={setStacked}
              disabled={type === "line"}
            />
            Стек
          </label>

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Switch size="sm" checked={grid} onCheckedChange={setGrid} />
            Сетка
          </label>

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Switch size="sm" checked={table} onCheckedChange={setTable} />
            Таблица значений
          </label>
        </div>

        <Chart
          data={TRAFFIC}
          series={series}
          x={point => point.date}
          type={type}
          stacked={stacked && type !== "line"}
          grid={grid ? "y" : "none"}
          height={320}
          dataTable={table ? "visible" : "sr-only"}
          ariaLabel="Трафик за 30 дней"
          formatX={value => format(value as Date, "d MMMM")}
        />
      </CardContent>
    </Card>
  );
};
