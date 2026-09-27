import { cn } from "@shared/lib/utils/cn";
import * as React from "react";

import { Card, CardContent, type CardProps } from "../card";
import { INTENT_SOFT } from "../foundation";

export type StatCardVariant =
  "default" | "success" | "warning" | "destructive" | "info" | "purple";

const ICON_CLASSES: Record<StatCardVariant, string> = {
  default: "bg-secondary text-secondary-foreground",
  success: INTENT_SOFT.success,
  warning: INTENT_SOFT.warning,
  destructive: INTENT_SOFT.destructive,
  info: INTENT_SOFT.info,
  purple: INTENT_SOFT.purple,
};

export interface StatCardProps extends Omit<
  CardProps,
  "title" | "description" | "variant" | "children"
> {
  title: React.ReactNode;
  value: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  /** Смысловая окраска значка. */
  variant?: StatCardVariant;
}

const CONTENT_CLASS = "flex items-start justify-between gap-3 p-3 sm:p-5";
const BODY_CLASS = "flex min-w-0 flex-1 flex-col gap-1.5";
const TITLE_CLASS =
  "text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const VALUE_CLASS = "truncate text-lg font-bold text-foreground sm:text-xl";
const DESCRIPTION_CLASS = "text-xs text-muted-foreground";
const ICON_BOX_CLASS =
  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11";

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      title,
      value,
      description,
      icon,
      variant = "default",
      contentClassName,
      ...props
    },
    ref,
  ) => (
    <Card ref={ref} {...props}>
      <CardContent className={cn(CONTENT_CLASS, contentClassName)}>
        <div className={BODY_CLASS}>
          <p className={TITLE_CLASS}>{title}</p>
          <div className={VALUE_CLASS}>{value}</div>
          {description && <p className={DESCRIPTION_CLASS}>{description}</p>}
        </div>
        {icon && (
          <div
            aria-hidden
            className={cn(ICON_BOX_CLASS, ICON_CLASSES[variant])}
          >
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  ),
);

StatCard.displayName = "StatCard";

export { StatCard };
