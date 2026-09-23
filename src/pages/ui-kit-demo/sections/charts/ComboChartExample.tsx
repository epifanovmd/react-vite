import { INotificationService } from "@shared/lib/notifications";
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

import { movingAverage, TRAFFIC, type TrafficPoint } from "./chart.data";

export const ComboChartExample: FC = () => {
  const toast = INotificationService.useInstance();

  const series = useMemo<ChartSeries<TrafficPoint>[]>(() => {
    const average = movingAverage(
      TRAFFIC.map(point => point.orders),
      7,
    );

    return [
      {
        key: "orders",
        label: "Заказы",
        type: "bar",
        value: point => point.orders,
      },
      {
        key: "average",
        label: "Среднее за 7 дней",
        type: "line",
        curve: "monotone",
        value: (_, index) => average[index],
      },
    ];
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Столбцы и линия вместе</CardTitle>
        <CardDescription className="text-xs">
          Обе серии на одной шкале — вторая ось не заводится намеренно. Клик по
          графику отдаёт точку в onPointClick
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Chart
          data={TRAFFIC}
          series={series}
          x={point => point.date}
          height={280}
          barSize={14}
          formatX={value => format(value as Date, "d MMMM")}
          onPointClick={point =>
            toast.info(
              `${point.label}: ${point.entries
                .map(entry => `${entry.label} — ${entry.formatted}`)
                .join(", ")}`,
            )
          }
          ariaLabel="Заказы и скользящее среднее за 30 дней"
        />
      </CardContent>
    </Card>
  );
};
