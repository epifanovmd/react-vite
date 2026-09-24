import { cn } from "@shared/lib/utils/cn";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { avatarVariants } from "./avatar-variants";

export interface AvatarProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  /** Имя: даёт инициалы для fallback и доступное имя. */
  name?: string;
  fallback?: React.ReactNode;
}

const getInitials = (name?: string): string => {
  if (!name) return "";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join("");
};

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    { className, size, shape, src, alt, name, fallback, children, ...props },
    ref,
  ) => {
    const [erroredSrc, setErroredSrc] = React.useState<string | null>(null);

    const showImage = Boolean(src) && erroredSrc !== src;
    const accessibleName = alt ?? name;
    const fallbackNode = children ?? fallback ?? (getInitials(name) || null);

    const handleError = () => setErroredSrc(src ?? null);

    return (
      <span
        ref={ref}
        role={showImage || !accessibleName ? undefined : "img"}
        aria-label={showImage ? undefined : accessibleName}
        className={cn(avatarVariants({ size, shape }), className)}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={accessibleName ?? ""}
            className="h-full w-full object-cover"
            onError={handleError}
          />
        ) : (
          fallbackNode
        )}
      </span>
    );
  },
);

Avatar.displayName = "Avatar";

export { Avatar };
