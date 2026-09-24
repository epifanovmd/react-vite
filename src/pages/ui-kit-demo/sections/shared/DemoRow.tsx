import type { ReactNode } from "react";

export interface DemoRowProps {
  /** Колонок на широком экране. */
  columns?: 2 | 3;
  children: ReactNode;
}

const COLUMNS_CLASS: Record<NonNullable<DemoRowProps["columns"]>, string> = {
  2: "grid grid-cols-1 items-start gap-4 sm:grid-cols-2",
  3: "grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3",
};

/** Адаптивная сетка для примеров в демо-секциях. */
export const DemoRow = ({ columns = 3, children }: DemoRowProps) => (
  <div className={COLUMNS_CLASS[columns]}>{children}</div>
);
