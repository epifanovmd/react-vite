import { cva } from "class-variance-authority";

import { INTENT_SOLID } from "../foundation/intent";

export const tagVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: INTENT_SOLID.secondary,
        primary: INTENT_SOLID.primary,
        secondary: INTENT_SOLID.secondary,
        destructive: INTENT_SOLID.destructive,
        success: INTENT_SOLID.success,
        warning: INTENT_SOLID.warning,
        info: INTENT_SOLID.info,
        outline: "border border-border bg-background text-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);
