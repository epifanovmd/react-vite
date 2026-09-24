import type { ReactNode } from "react";

export interface DemoGroupTitleProps {
  children: ReactNode;
}

const TITLE_CLASS =
  "text-xs font-semibold uppercase tracking-wider text-muted-foreground";

/** Заголовок группы примеров внутри демо-секции. */
export const DemoGroupTitle = ({ children }: DemoGroupTitleProps) => (
  <p className={TITLE_CLASS}>{children}</p>
);
