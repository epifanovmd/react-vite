import type { ChartSeries } from "@shared/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Chart,
} from "@shared/ui";
import { FC, useMemo } from "react";

import { type ChannelPoint, CHANNELS } from "./chart.data";

export const ChannelsBarsExample: FC = () => {
  const series = useMemo<ChartSeries<ChannelPoint>[]>(
    () => [
      { key: "mobile", label: "Мобильные", value: point => point.mobile },
      { key: "desktop", label: "Десктоп", value: point => point.desktop },
    ],
    [],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Сгруппированные столбцы</CardTitle>
        <CardDescription className="text-xs">
          Категории по X: слот делится между сериями, наведение подсвечивает всю
          группу
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Chart
          data={CHANNELS}
          series={series}
          x={point => point.channel}
          type="bar"
          height={260}
          ariaLabel="Сессии по каналам и устройствам"
        />
      </CardContent>
    </Card>
  );
};
