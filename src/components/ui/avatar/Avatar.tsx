import { cn } from "@utils/cn";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { avatarVariants } from "./avatarVariants";

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
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
    const [errored, setErrored] = React.useState(false);

    React.useEffect(() => setErrored(false), [src]);

    const showImage = src && !errored;

    return (
      <span
        ref={ref}
        className={cn(avatarVariants({ size, shape }), className)}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt ?? name ?? ""}
            className="h-full w-full object-cover"
            onError={() => setErrored(true)}
          />
        ) : (
          (children ?? fallback ?? (getInitials(name) || null))
        )}
      </span>
    );
  },
);

Avatar.displayName = "Avatar";

export { Avatar };
