import { cn } from "@shared/lib/utils/cn";
import { FC, HTMLAttributes } from "react";

/** Клавиша: горячая клавиша класса, подсказка в редакторе. */
export const Kbd: FC<HTMLAttributes<HTMLElement>> = ({
  className,
  ...props
}) => (
  <kbd
    className={cn(
      "rounded border border-border bg-muted px-1 font-mono text-[10px] text-muted-foreground",
      className,
    )}
    {...props}
  />
);
