import { FC } from "react";

import {
  ChartStatesExample,
  CompactTrendExample,
  RevenueAreaExample,
  TrafficLineExample,
} from "./charts";

export const ChartsSection: FC = () => (
  <div className="flex flex-col gap-4">
    <TrafficLineExample />
    <RevenueAreaExample />
    <CompactTrendExample />
    <ChartStatesExample />
  </div>
);
