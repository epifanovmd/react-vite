import { cn } from "@utils/cn";
import { FC, ReactNode } from "react";

export interface InfoFieldProps {
  label: string;
  value?: ReactNode;
  /** Действие справа от значения (кнопка, иконка и т.п.). */
  action?: ReactNode;
  className?: string;
}

/**
 * Презентационное поле «лейбл / значение» с опциональным действием.
 * Доменно-нейтральный примитив для detail/settings-экранов.
 */
export const InfoField: FC<InfoFieldProps> = ({
  label,
  value,
  action,
  className,
}) => (
  <div className={cn("flex items-start justify-between gap-3 p-4", className)}>
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="truncate text-sm font-medium text-foreground">
        {value || "—"}
      </span>
    </div>
    {action}
  </div>
);
