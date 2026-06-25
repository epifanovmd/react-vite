import { cva } from "class-variance-authority";

import { INTENT_SOLID } from "../foundation/intent";

export const chipsVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: `${INTENT_SOLID.secondary} hover:bg-secondary/80`,
        primary: `${INTENT_SOLID.primary} hover:bg-primary/90`,
        secondary: `${INTENT_SOLID.secondary} hover:bg-secondary/80`,
        destructive: `${INTENT_SOLID.destructive} hover:bg-destructive/90`,
        success: `${INTENT_SOLID.success} hover:bg-success/90`,
        warning: `${INTENT_SOLID.warning} hover:bg-warning/90`,
        info: `${INTENT_SOLID.info} hover:bg-info/90`,
        outline:
          "border border-border bg-background text-foreground hover:bg-accent",
      },
      size: {
        sm: "px-2.5 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
      },
      clickable: {
        true: "cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      clickable: false,
    },
  },
);
