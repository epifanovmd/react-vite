import { cn } from "@shared/lib/utils/cn";
import * as React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Доля от 0 до 1. */
  value: number;
  /** Неопределённый прогресс — бегущая полоса. */
  indeterminate?: boolean;
  size?: "sm" | "md";
  color?: "brand" | "success" | "destructive";
}

const COLOR = {
  brand: "bg-brand",
  success: "bg-success",
  destructive: "bg-destructive",
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  indeterminate,
  size = "md",
  color = "brand",
  className,
  ...props
}) => {
  const percent = Math.round(Math.max(0, Math.min(1, value)) * 100);

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : percent}
      className={cn(
        "w-full overflow-hidden rounded-full bg-muted",
        size === "sm" ? "h-1" : "h-2",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-300",
          COLOR[color],
          indeterminate && "w-1/3 animate-pulse",
        )}
        style={indeterminate ? undefined : { width: `${percent}%` }}
      />
    </div>
  );
};
