import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Sparkline,
} from "@shared/ui";
import { FC } from "react";

import { TRAFFIC, type TrafficPoint } from "./chart.data";

const TILES: {
  key: keyof Omit<TrafficPoint, "date">;
  title: string;
  color: string;
}[] = [
  { key: "visits", title: "Визиты", color: "var(--chart-1)" },
  { key: "signups", title: "Регистрации", color: "var(--chart-3)" },
  { key: "orders", title: "Заказы", color: "var(--chart-2)" },
];

const number = new Intl.NumberFormat("ru-RU");

export const SparklineExample: FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Sparkline</CardTitle>
      <CardDescription className="text-xs">
        Тренд рядом с числом: тот же компонент без осей, сетки и легенды
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid gap-3 sm:grid-cols-3">
        {TILES.map(tile => {
          const last = TRAFFIC[TRAFFIC.length - 1][tile.key];
          const previous = TRAFFIC[TRAFFIC.length - 8][tile.key];
          const delta = Math.round(((last - previous) / previous) * 100);

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
                <span
                  className={
                    delta >= 0
                      ? "text-xs text-success"
                      : "text-xs text-destructive"
                  }
                >
                  {delta >= 0 ? "+" : ""}
                  {delta}% к прошлой неделе
                </span>
              </div>
              <Sparkline
                data={TRAFFIC}
                x={point => point.date}
                value={point => point[tile.key]}
                label={tile.title}
                color={tile.color}
                area
                ariaLabel={`${tile.title}: динамика за 30 дней`}
              />
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);
