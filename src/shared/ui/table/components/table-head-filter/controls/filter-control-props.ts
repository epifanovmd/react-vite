import type { Column } from "@tanstack/react-table";

export interface FilterControlProps<TConfig, TData = unknown> {
  config: TConfig;
  column: Column<TData, unknown>;
}
