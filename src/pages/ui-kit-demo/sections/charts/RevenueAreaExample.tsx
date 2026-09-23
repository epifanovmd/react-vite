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

export const RevenueAreaExample: FC = () => {
  const series = useMemo<ChartSeries<RevenuePoint>[]>(
    () => [
      {
        key: "subscriptions",
        label: "Подписки",
        stackId: "revenue",
        value: point => point.subscriptions,
      },
      {
        key: "services",
        label: "Услуги",
        stackId: "revenue",
        value: point => point.services,
      },
      {
        key: "ads",
        label: "Реклама",
        stackId: "revenue",
        value: point => point.ads,
      },
    ],
    [],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Область со стеком</CardTitle>
        <CardDescription className="text-xs">
          Серии с общим stackId складываются; тултип показывает и сумму
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Chart
          data={REVENUE}
          series={series}
          x={point => point.month}
          type="area"
          stacked
          height={260}
          formatValue={value => money.format(value)}
          formatX={value => format(value as Date, "LLLL yyyy")}
          yAxis={{ tickFormat: value => money.format(value) }}
          referenceLines={[{ y: 2_000_000, label: "План" }]}
          ariaLabel="Выручка по направлениям за 12 месяцев"
        />
      </CardContent>
    </Card>
  );
};
