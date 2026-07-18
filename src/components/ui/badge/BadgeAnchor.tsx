import { cn } from "@utils/cn";
import * as React from "react";

import { Badge, type BadgeProps } from "./Badge";
import { badgeVariants } from "./badgeVariants";

export type BadgeAnchorPlacement =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

export interface BadgeAnchorProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "content"> {
  content?: React.ReactNode;
  dot?: boolean;
  variant?: BadgeProps["variant"];
  max?: number;
  showZero?: boolean;
  placement?: BadgeAnchorPlacement;
  children: React.ReactNode;
}

const PLACEMENT_CLASSES: Record<BadgeAnchorPlacement, string> = {
  "top-right": "top-0 right-0 -translate-y-1/2 translate-x-1/2",
  "top-left": "top-0 left-0 -translate-y-1/2 -translate-x-1/2",
  "bottom-right": "bottom-0 right-0 translate-y-1/2 translate-x-1/2",
  "bottom-left": "bottom-0 left-0 translate-y-1/2 -translate-x-1/2",
};

export const BadgeAnchor = React.forwardRef<HTMLSpanElement, BadgeAnchorProps>(
  (
    {
      content,
      dot,
      variant,
      max,
      showZero = false,
      placement = "top-right",
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const isZero = content === 0;
    const isEmpty = content == null || content === "" || (isZero && !showZero);
    const showBadge = dot || !isEmpty;

    return (
      <span
        ref={ref}
        className={cn("relative inline-flex", className)}
        {...props}
      >
        {children}
        {showBadge &&
          (dot ? (
            <span
              className={cn(
                badgeVariants({ variant }),
                "absolute z-10 h-2.5 w-2.5 min-w-0 rounded-full p-0 ring-2 ring-background",
                PLACEMENT_CLASSES[placement],
              )}
            />
          ) : (
            <Badge
              variant={variant}
              max={max}
              className={cn(
                "absolute z-10 ring-2 ring-background",
                PLACEMENT_CLASSES[placement],
              )}
            >
              {content}
            </Badge>
          ))}
      </span>
    );
  },
);

BadgeAnchor.displayName = "BadgeAnchor";
