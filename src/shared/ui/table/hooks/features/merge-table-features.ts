import type { TableOptions, TableState } from "@tanstack/react-table";

import type { TableFeatureKind, TableFeatureResult } from "./types";

export interface MergedTableFeatures<TData> {
  state: Partial<TableState>;
  options: Partial<Omit<TableOptions<TData>, "data" | "columns" | "state">>;
  byKind: Map<TableFeatureKind, TableFeatureResult<TData>>;
}

export const mergeTableFeatures = <TData>(
  features: TableFeatureResult<TData>[],
): MergedTableFeatures<TData> => {
  const state: Partial<TableState> = {};
  const options: Partial<
    Omit<TableOptions<TData>, "data" | "columns" | "state">
  > = {};
  const byKind = new Map<TableFeatureKind, TableFeatureResult<TData>>();

  for (const feature of features) {
    Object.assign(state, feature.state);
    Object.assign(options, feature.options);
    byKind.set(feature.kind, feature);
  }

  return { state, options, byKind };
};
