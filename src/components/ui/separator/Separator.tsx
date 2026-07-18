import { cn } from "@utils/cn";
import * as React from "react";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  label?: React.ReactNode;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      label,
      ...props
    },
    ref,
  ) => {
    if (label && orientation === "horizontal") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-3 text-xs text-muted-foreground",
            className,
          )}
          {...props}
        >
          <span className="h-px flex-1 bg-border" />
          {label}
          <span className="h-px flex-1 bg-border" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch",
          className,
        )}
        {...props}
      />
    );
  },
);

Separator.displayName = "Separator";

export { Separator };
export const Divider = Separator;
