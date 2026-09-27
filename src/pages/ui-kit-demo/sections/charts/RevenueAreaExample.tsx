import type { ChartSeries } from "@shared/ui";
import {
  AreaChart,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Switch,
} from "@shared/ui";
import { format } from "date-fns";
import { FC, useMemo, useState } from "react";

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

export const RevenueAreaExample: FC = () => {
  const [stacked, setStacked] = useState(true);

  const series = useMemo<ChartSeries<RevenuePoint>[]>(
    () => [
      {
        key: "subscriptions",
        label: "Подписки",
        value: point => point.subscriptions,
      },
      { key: "services", label: "Услуги", value: point => point.services },
      { key: "ads", label: "Реклама", value: point => point.ads },
    ],
    [],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">AreaChart</CardTitle>
        <CardDescription className="text-xs">
          Со `stacked` серии складываются, а тултип показывает сумму;
          форматирование значений общее для оси и тултипа
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Switch size="sm" checked={stacked} onCheckedChange={setStacked} />
          Стек
        </label>

        <AreaChart
          data={REVENUE}
          series={series}
          x={point => point.month}
          stacked={stacked}
          height={260}
          formatValue={formatMoney}
          formatX={formatMonth}
          yAxis={{ tickFormat: formatMoney }}
          ariaLabel="Выручка по направлениям за 12 месяцев"
        />
      </CardContent>
    </Card>
  );
};
