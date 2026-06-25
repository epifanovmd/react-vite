import { cva } from "class-variance-authority";

import { CONTROL_SQUARE } from "../controlSize";

export const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-accent text-accent-foreground",
        enable: "hover:bg-success/10 text-success",
        disable: "hover:bg-warning/10 text-warning",
        destructive: "hover:bg-destructive/10 text-destructive",
        primary: "text-muted-foreground hover:bg-primary/10 hover:text-primary",
        ghost: "text-foreground",
        solid:
          "rounded-full bg-primary text-primary-foreground hover:bg-primary/85 shadow-sm hover:shadow-md",
      },
      size: {
        sm: `${CONTROL_SQUARE.sm} p-1`,
        md: `${CONTROL_SQUARE.md} p-1.5`,
        lg: `${CONTROL_SQUARE.lg} p-2`,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);
