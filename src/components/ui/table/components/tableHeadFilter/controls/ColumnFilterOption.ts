import type { ReactNode } from "react";

export interface ColumnFilterOption<T = string> {
  value: T;
  label: ReactNode;
}
