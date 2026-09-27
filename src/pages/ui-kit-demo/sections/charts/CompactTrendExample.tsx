import type { ChartSeries } from "@shared/ui";
import {
  AreaChart,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui";
import { FC } from "react";

import { TRAFFIC, type TrafficPoint } from "./chart.data";

interface Tile {
  key: keyof Omit<TrafficPoint, "date">;
  title: string;
  color: string;
}

const TILES: Tile[] = [
  { key: "visits", title: "Визиты", color: "var(--chart-1)" },
  { key: "signups", title: "Регистрации", color: "var(--chart-3)" },
  { key: "orders", title: "Заказы", color: "var(--chart-2)" },
];

const COMPACT_MARGIN = { top: 4, right: 4, bottom: 4, left: 4 };

const number = new Intl.NumberFormat("ru-RU");

const WEEK = 7;

const weekDelta = (key: Tile["key"]) => {
  const last = TRAFFIC[TRAFFIC.length - 1][key];
  const previous = TRAFFIC[TRAFFIC.length - 1 - WEEK][key];

  return { last, delta: Math.round(((last - previous) / previous) * 100) };
};

const tileSeries = (tile: Tile): ChartSeries<TrafficPoint>[] => [
  {
    key: tile.key,
    label: tile.title,
    color: tile.color,
    value: p => p[tile.key],
  },
];

export const CompactTrendExample: FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Компактный тренд</CardTitle>
      <CardDescription className="text-xs">
        Тот же AreaChart без осей, сетки и легенды — только форма и тултип
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid gap-3 sm:grid-cols-3">
        {TILES.map(tile => {
          const { last, delta } = weekDelta(tile.key);
          const deltaClassName =
            delta >= 0 ? "text-xs text-success" : "text-xs text-destructive";

          return (
            <div
              key={tile.key}
              className="flex flex-col gap-1.5 rounded-xl border bg-card p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {tile.title}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">{number.format(last)}</span>
                <span className={deltaClassName}>
                  {delta >= 0 ? "+" : ""}
                  {delta}% к прошлой неделе
                </span>
              </div>
              <AreaChart
                data={TRAFFIC}
                series={tileSeries(tile)}
                x={point => point.date}
                height={48}
                margin={COMPACT_MARGIN}
                grid="none"
                xAxis={false}
                yAxis={false}
                legend={false}
                ariaLabel={`${tile.title}: динамика за 30 дней`}
              />
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);
