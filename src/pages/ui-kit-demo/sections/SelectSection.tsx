import type { FC } from "react";

import {
  Appearance,
  Capabilities,
  Creatable,
  CustomRendering,
  Dependent,
  DropdownPositioning,
  Grouped,
  LabelInValue,
  RefApi,
  StrategiesExt,
  VirtualOptions,
} from "./select";

export const SelectSection: FC = () => (
  <div className="flex flex-col gap-4">
    <Appearance />
    <Capabilities />
    <Creatable />
    <VirtualOptions />
    <CustomRendering />
    <RefApi />
    <LabelInValue />
    <DropdownPositioning />
    <StrategiesExt />
    <Dependent />
    <Grouped />
  </div>
);
