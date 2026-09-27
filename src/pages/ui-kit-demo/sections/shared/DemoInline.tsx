import type { ReactNode } from "react";

export interface DemoInlineProps {
  /** `loose` — для контролов с подписями, чтобы подпись не липла к соседу. */
  spacing?: "tight" | "loose";
  children: ReactNode;
}

const SPACING_CLASS: Record<NonNullable<DemoInlineProps["spacing"]>, string> = {
  tight: "flex flex-wrap items-center gap-2",
  loose: "flex flex-wrap items-center gap-x-6 gap-y-3",
};

/** Строка однотипных элементов (бейджи, чипы, кнопки) с переносом. */
export const DemoInline = ({
  spacing = "tight",
  children,
}: DemoInlineProps) => <div className={SPACING_CLASS[spacing]}>{children}</div>;
