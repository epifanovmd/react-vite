import { FC } from "react";

import {
  ChannelsBarsExample,
  ChartStatesExample,
  ComboChartExample,
  RevenueAreaExample,
  SparklineExample,
  TrafficChartExample,
} from "./charts";

export const ChartsSection: FC = () => (
  <div className="flex flex-col gap-4">
    <TrafficChartExample />

    <div className="grid gap-4 lg:grid-cols-2">
      <RevenueAreaExample />
      <ChannelsBarsExample />
    </div>

    <ComboChartExample />
    <SparklineExample />
    <ChartStatesExample />
  </div>
);
