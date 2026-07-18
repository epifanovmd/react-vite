import { cn } from "@utils/cn";
import { FC, ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
  className,
}) => {
  return (
    <div
      className={cn(
        "border-b border-border bg-card/80 backdrop-blur",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          {icon && (
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
              {icon}
            </div>
          )}
          <div className="flex min-w-0 flex-col">
            <p className="truncate text-lg font-bold leading-tight tracking-tight text-foreground">
              {title}
            </p>
            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
};
