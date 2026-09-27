import type { ChartSeries, ChartTooltipData } from "@shared/ui";
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
import { FC, useMemo } from "react";

import { REVENUE, type RevenuePoint } from "./chart.data";

const money = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 1,
  notation: "compact",
});

const formatMoney = (value: number) => money.format(value);

const formatMonth = (value: Date | number | string) =>
  format(value as Date, "LLLL yyyy");

const renderRevenueTooltip = ({
  index,
  datum,
  label,
}: ChartTooltipData<RevenuePoint>) => {
  const previous = REVENUE[index - 1]?.subscriptions;

  const delta = previous
    ? Math.round(((datum.subscriptions - previous) / previous) * 100)
    : 0;

  const deltaClassName =
    delta >= 0 ? "text-xs text-success" : "text-xs text-destructive";

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums">
        {money.format(datum.subscriptions)}
      </p>
      <p className={deltaClassName}>
        {delta >= 0 ? "+" : ""}
        {delta}% к прошлому месяцу
      </p>
    </div>
  );
};

export const ChartStatesExample: FC = () => {
  const series = useMemo<ChartSeries<RevenuePoint>[]>(
    () => [
      {
        key: "subscriptions",
        label: "Подписки",
        value: point => point.subscriptions,
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
            <AreaChart
              data={REVENUE}
              series={series}
              x={point => point.month}
              height={200}
              loading
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Нет данных</p>
            <AreaChart
              data={[]}
              series={series}
              x={point => point.month}
              height={200}
              emptyText="За период нет продаж"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Свой тултип</p>
            <LineChart
              data={REVENUE}
              series={series}
              x={point => point.month}
              height={200}
              showPoints
              formatX={formatMonth}
              yAxis={{ tickFormat: formatMoney }}
              renderTooltip={renderRevenueTooltip}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
