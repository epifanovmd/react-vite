import { cva } from "class-variance-authority";

import { INTENT_SOFT, INTENT_SOLID } from "../foundation/intent";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 justify-center rounded-full font-semibold max-w-full overflow-hidden truncate transition-all duration-200 h-5 min-w-5 px-2 text-xs",
  {
    variants: {
      variant: {
        default: INTENT_SOLID.secondary,
        primary: INTENT_SOLID.primary,
        secondary: INTENT_SOLID.secondary,
        destructive: INTENT_SOFT.destructive,
        danger: INTENT_SOFT.destructive,
        gray: INTENT_SOLID.secondary,
        purple: INTENT_SOFT.purple,
        success: INTENT_SOFT.success,
        warning: INTENT_SOFT.warning,
        info: INTENT_SOFT.info,
        outline: "border border-border bg-background text-foreground",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
