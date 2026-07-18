import { cn } from "@utils/cn";
import * as React from "react";

import { type AvatarProps } from "./Avatar";
import { avatarVariants } from "./avatarVariants";

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarProps["size"];
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max, size, children, ...props }, ref) => {
    const items = React.Children.toArray(children).filter(
      React.isValidElement,
    ) as React.ReactElement<AvatarProps>[];

    const visible = typeof max === "number" ? items.slice(0, max) : items;
    const overflow =
      typeof max === "number" ? Math.max(0, items.length - max) : 0;

    return (
      <div
        ref={ref}
        className={cn("flex items-center -space-x-2", className)}
        {...props}
      >
        {visible.map((child, index) =>
          React.cloneElement(child, {
            key: index,
            size: child.props.size ?? size,
            className: cn("ring-2 ring-background", child.props.className),
          }),
        )}
        {overflow > 0 && (
          <span
            className={cn(
              avatarVariants({ size: size ?? "md", shape: "circle" }),
              "ring-2 ring-background",
            )}
          >
            +{overflow}
          </span>
        )}
      </div>
    );
  },
);

AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };
