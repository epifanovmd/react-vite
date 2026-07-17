import type { ComponentType } from "react";

import type { ColumnFilterOption } from "./controls/ColumnFilterOption";
import type { FilterControlProps } from "./controls/FilterControlProps";
import type { MultiSelectFilterConfig } from "./controls/MultiSelectFilterControl";
import { MultiSelectFilterControl } from "./controls/MultiSelectFilterControl";
import type { SelectFilterConfig } from "./controls/SelectFilterControl";
import { SelectFilterControl } from "./controls/SelectFilterControl";
import type { TextFilterConfig } from "./controls/TextFilterControl";
import { TextFilterControl } from "./controls/TextFilterControl";

export type { ColumnFilterOption };

export type ColumnFilterConfig<T = string> =
  | TextFilterConfig
  | SelectFilterConfig<T>
  | MultiSelectFilterConfig<T>;

/**
 * To add a new filter type: create `controls/<Name>FilterControl.tsx`
 * exporting its `<Name>FilterConfig` type + component, add the config type
 * to the `ColumnFilterConfig` union above, and register the component here.
 */
export const FILTER_CONTROLS: Record<
  ColumnFilterConfig["type"],
  ComponentType<FilterControlProps<any, any>>
> = {
  text: TextFilterControl,
  select: SelectFilterControl,
  multiselect: MultiSelectFilterControl,
};
