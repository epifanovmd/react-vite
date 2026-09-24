import { cn } from "@shared/lib/utils/cn";
import * as React from "react";

export interface SelectListGroupProps {
  label: string;
  className?: string;
  children?: React.ReactNode;
}

export const SelectListGroup = ({
  label,
  className,
  children,
}: SelectListGroupProps) => {
  const labelId = React.useId();

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className={cn("py-1", className)}
    >
      <div
        id={labelId}
        className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
      >
        {label}
      </div>
      {children}
    </div>
  );
};
