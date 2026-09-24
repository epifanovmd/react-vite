import { cn } from "@shared/lib/utils/cn";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { UISection } from "../sections";

export interface UiKitPagerLinkProps {
  section: UISection;
  direction: "previous" | "next";
}

const LINK_CLASS =
  "group flex flex-col gap-1 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const DIRECTION = {
  previous: { caption: "Назад", Icon: ChevronLeft, className: "items-start" },
  next: {
    caption: "Далее",
    Icon: ChevronRight,
    className: "items-end text-right",
  },
} as const;

/** Карточка перехода к соседнему разделу. */
export const UiKitPagerLink = ({ section, direction }: UiKitPagerLinkProps) => {
  const { caption, Icon, className } = DIRECTION[direction];

  return (
    <Link
      to="/ui/$section"
      params={{ section: section.value }}
      className={cn(LINK_CLASS, className)}
    >
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        {direction === "previous" && (
          <Icon aria-hidden className="h-3.5 w-3.5" />
        )}
        {caption}
        {direction === "next" && <Icon aria-hidden className="h-3.5 w-3.5" />}
      </span>
      <span className="text-sm font-medium">{section.label}</span>
    </Link>
  );
};
