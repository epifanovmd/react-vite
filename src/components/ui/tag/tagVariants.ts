import { cva } from "class-variance-authority";

import { INTENT_SOLID } from "../foundation/intent";

export const tagVariants = cva(
  "inline-flex items-center gap-1.5 rounded font-medium transition-all duration-200 px-2 py-0.5 text-xs",
  {
    variants: {
      variant: {
        default: INTENT_SOLID.secondary,
        primary: INTENT_SOLID.primary,
        secondary: INTENT_SOLID.secondary,
        destructive: INTENT_SOLID.destructive,
        danger: INTENT_SOLID.destructive,
        gray: INTENT_SOLID.secondary,
        success: INTENT_SOLID.success,
        warning: INTENT_SOLID.warning,
        info: INTENT_SOLID.info,
        outline: "border border-border bg-background text-foreground",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
