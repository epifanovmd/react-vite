import type { FC } from "react";

import {
  Appearance,
  Capabilities,
  CustomRendering,
  Dependent,
  DropdownPositioning,
  Grouped,
  LabelInValue,
  RefApi,
  StrategiesExt,
} from "./select";

export const SelectSection: FC = () => (
  <div className="flex flex-col gap-4">
    <Appearance />
    <Capabilities />
    <CustomRendering />
    <RefApi />
    <LabelInValue />
    <DropdownPositioning />
    <StrategiesExt />
    <Dependent />
    <Grouped />
  </div>
);
