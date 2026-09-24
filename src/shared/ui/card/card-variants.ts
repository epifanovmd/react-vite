import { cva } from "class-variance-authority";

export const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "",
        elevated: "shadow-md hover:shadow-lg",
        outline: "border-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
