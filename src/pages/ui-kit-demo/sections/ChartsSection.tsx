import { FC } from "react";

import {
  ChartStatesExample,
  CompactTrendExample,
  RevenueAreaExample,
  TargetAnnotationsExample,
  TrafficLineExample,
} from "./charts";

export const ChartsSection: FC = () => (
  <div className="flex flex-col gap-4">
    <TrafficLineExample />
    <RevenueAreaExample />
    <TargetAnnotationsExample />
    <CompactTrendExample />
    <ChartStatesExample />
  </div>
);
