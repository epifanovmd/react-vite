import { cn } from "@shared/lib/utils/cn";
import { FC, ReactNode } from "react";

export interface LabeledFieldProps {
  label: ReactNode;
  /** Короткое пояснение справа от подписи: единицы, особые значения */
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Подпись над неуправляемым формой контролом. Подпись держится в одну
 * строку (длинная — обрезается): иначе поле с двухстрочной подписью съезжает
 * вниз и строка сетки разъезжается.
 */
export const LabeledField: FC<LabeledFieldProps> = ({
  label,
  hint,
  className,
  children,
}) => (
  <label
    className={cn(
      "flex min-w-0 flex-col gap-1 text-xs text-muted-foreground",
      className,
    )}
  >
    <span className="flex items-baseline justify-between gap-1">
      <span className="truncate">{label}</span>
      {hint && <span className="shrink-0 text-[10px] opacity-70">{hint}</span>}
    </span>
    {children}
  </label>
);
