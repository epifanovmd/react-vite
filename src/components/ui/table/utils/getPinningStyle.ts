import type { Column } from "@tanstack/react-table";
import type { CSSProperties } from "react";

import { cn } from "../../foundation";

export interface PinningStyleResult {
  style?: CSSProperties;
  className?: string;
}

export const getPinningStyle = <TData, TValue>(
  column: Column<TData, TValue>,
): PinningStyleResult => {
  const pinned = column.getIsPinned();

  if (!pinned) return {};

  const isLastLeft = pinned === "left" && column.getIsLastColumn("left");
  const isFirstRight = pinned === "right" && column.getIsFirstColumn("right");

  return {
    style: {
      position: "sticky",
      left: pinned === "left" ? column.getStart("left") : undefined,
      right: pinned === "right" ? column.getAfter("right") : undefined,
      zIndex: 1,
    },
    className: cn(
      "bg-card",
      isLastLeft && "shadow-[2px_0_4px_-2px_rgba(0,0,0,0.15)]",
      isFirstRight && "shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.15)]",
    ),
  };
};
