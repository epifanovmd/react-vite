import { cva } from "class-variance-authority";

export const kanbanBoardVariants = cva(
  "flex h-full w-full items-start gap-4 overflow-x-auto pb-2",
);

export const kanbanColumnVariants = cva(
  "flex h-full min-h-40 w-72 shrink-0 flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-surface-1 transition-colors duration-200",
  {
    variants: {
      previewValid: {
        true: "bg-success/5",
        false: "",
      },
      previewInvalid: {
        true: "bg-destructive/5",
        false: "",
      },
      isOver: {
        true: "border-dashed border-primary/60 bg-primary/5",
        false: "border-solid border-border/60",
      },
      isInvalid: {
        true: "cursor-not-allowed border-dashed border-destructive/60 bg-destructive/5",
        false: "",
      },
    },
    defaultVariants: {
      previewValid: false,
      previewInvalid: false,
      isOver: false,
      isInvalid: false,
    },
  },
);

export const kanbanCardVariants = cva(
  "cursor-grab select-none rounded-xl border text-card-foreground transition-all duration-200 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      isDragging: {
        true: "border-dashed border-primary/50 bg-primary/5 opacity-60 shadow-none",
        false:
          "border-solid border-border/60 bg-card shadow-sm hover:border-border hover:shadow-md",
      },
    },
    defaultVariants: {
      isDragging: false,
    },
  },
);
