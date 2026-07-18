import { cn } from "@utils/cn";
import * as React from "react";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-2 p-3 md:px-6 md:py-4 pt-0",
      className,
    )}
    {...props}
  />
));

CardFooter.displayName = "CardFooter";

export { CardFooter };
