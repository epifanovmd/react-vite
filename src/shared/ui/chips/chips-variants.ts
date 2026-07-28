import { cva } from "class-variance-authority";

import { INTENT_SOLID } from "../foundation/intent";

export const chipsVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200 px-2.5 py-0.5 text-xs",
  {
    variants: {
      variant: {
        default: "",
        primary: "",
        secondary: "",
        destructive: "",
        danger: "",
        gray: "",
        success: "",
        warning: "",
        info: "",
        outline: "",
        muted: "",
      },
      active: {
        true: "",
        false: "",
      },
      clickable: {
        true: "cursor-pointer",
        false: "",
      },
    },
    compoundVariants: [
      { variant: "default", active: true, className: `${INTENT_SOLID.secondary} hover:opacity-90` },
      { variant: "default", active: false, className: "border border-border bg-background text-foreground hover:bg-accent" },
      { variant: "primary", active: true, className: `${INTENT_SOLID.primary} hover:opacity-90` },
      { variant: "primary", active: false, className: "border border-primary/40 bg-background text-primary hover:bg-primary/5" },
      { variant: "secondary", active: true, className: `${INTENT_SOLID.secondary} hover:opacity-90` },
      { variant: "secondary", active: false, className: "border border-border bg-background text-foreground hover:bg-accent" },
      { variant: "destructive", active: true, className: `${INTENT_SOLID.destructive} hover:opacity-90` },
      { variant: "destructive", active: false, className: "border border-destructive/40 bg-background text-destructive hover:bg-destructive/5" },
      { variant: "danger", active: true, className: `${INTENT_SOLID.destructive} hover:opacity-90` },
      { variant: "danger", active: false, className: "border border-destructive/40 bg-background text-destructive hover:bg-destructive/5" },
      { variant: "gray", active: true, className: `${INTENT_SOLID.secondary} hover:opacity-90` },
      { variant: "gray", active: false, className: "border border-border bg-background text-foreground hover:bg-accent" },
      { variant: "success", active: true, className: `${INTENT_SOLID.success} hover:opacity-90` },
      { variant: "success", active: false, className: "border border-success/40 bg-background text-success hover:bg-success/5" },
      { variant: "warning", active: true, className: `${INTENT_SOLID.warning} hover:opacity-90` },
      { variant: "warning", active: false, className: "border border-warning/40 bg-background text-warning hover:bg-warning/5" },
      { variant: "info", active: true, className: `${INTENT_SOLID.info} hover:opacity-90` },
      { variant: "info", active: false, className: "border border-info/40 bg-background text-info hover:bg-info/5" },
      { variant: "outline", active: true, className: "border border-border bg-background text-foreground hover:bg-accent" },
      { variant: "outline", active: false, className: "border border-border bg-background text-foreground hover:bg-accent" },
      { variant: "muted", active: true, className: "bg-muted text-muted-foreground hover:bg-muted/80" },
      { variant: "muted", active: false, className: "bg-muted/50 text-muted-foreground hover:bg-muted/80" },
    ],
    defaultVariants: {
      variant: "default",
      active: true,
      clickable: false,
    },
  },
);
