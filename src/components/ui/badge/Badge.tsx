import { cn } from "@utils/cn";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { badgeVariants } from "./badgeVariants";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  /** When `children` is a number greater than `max`, renders `${max}+` instead. */
  max?: number;
}

const formatContent = (
  children: React.ReactNode,
  max?: number,
): React.ReactNode =>
  max != null && typeof children === "number" && children > max
    ? `${max}+`
    : children;

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, dot, max, children, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {dot && (
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 flex-shrink-0" />
        )}
        <span className="truncate min-w-0">{formatContent(children, max)}</span>
      </div>
    );
  },
);

Badge.displayName = "Badge";

export { Badge };
