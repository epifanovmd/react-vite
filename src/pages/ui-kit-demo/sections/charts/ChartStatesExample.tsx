import type { ChartSeries } from "@shared/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Chart,
} from "@shared/ui";
import { format } from "date-fns";
import { FC, useMemo } from "react";

import { REVENUE, type RevenuePoint } from "./chart.data";

const money = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 1,
  notation: "compact",
});

export const ChartStatesExample: FC = () => {
  const series = useMemo<ChartSeries<RevenuePoint>[]>(
    () => [
      {
        key: "subscriptions",
        label: "Подписки",
        value: point => point.subscriptions,
        points: true,
      },
    ],
    [],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Состояния и свой тултип</CardTitle>
        <CardDescription className="text-xs">
          Загрузка держит высоту, пустые данные не рисуют оси, renderTooltip
          заменяет только содержимое всплывающего блока
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Загрузка</p>
            <Chart
              data={REVENUE}
              series={series}
              x={point => point.month}
              type="area"
              height={200}
              loading
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Нет данных</p>
            <Chart
              data={[]}
              series={series}
              x={point => point.month}
              type="area"
              height={200}
              emptyText="За период нет продаж"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Свой тултип</p>
            <Chart
              data={REVENUE}
              series={series}
              x={point => point.month}
              height={200}
              formatX={value => format(value as Date, "LLLL yyyy")}
              yAxis={{ tickFormat: value => money.format(value) }}
              renderTooltip={data => {
                const previous = REVENUE[data.index - 1]?.subscriptions;

                const delta = previous
                  ? Math.round(
                      ((data.datum.subscriptions - previous) / previous) * 100,
                    )
                  : 0;

                return (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {data.label}
                    </p>
                    <p className="text-sm font-semibold tabular-nums">
                      {money.format(data.datum.subscriptions)}
                    </p>
                    <p
                      className={
                        delta >= 0
                          ? "text-xs text-success"
                          : "text-xs text-destructive"
                      }
                    >
                      {delta >= 0 ? "+" : ""}
                      {delta}% к прошлому месяцу
                    </p>
                  </div>
                );
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
