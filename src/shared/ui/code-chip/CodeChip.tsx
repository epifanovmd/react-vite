import { cn } from "@shared/lib/utils/cn";
import { FC, HTMLAttributes } from "react";

export interface CodeChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Приглушённый пунктир: элемент есть, но не задействован */
  muted?: boolean;
}

/** Короткое техническое имя моноширинным: класс модели, индекс датасета. */
export const CodeChip: FC<CodeChipProps> = ({
  muted = false,
  className,
  children,
  ...props
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded border px-1.5 font-mono text-[11px]",
      muted
        ? "border-dashed border-border text-muted-foreground line-through"
        : "border-border bg-muted/40 text-foreground",
      className,
    )}
    {...props}
  >
    {children}
  </span>
);
