import { cn } from "@shared/lib/utils/cn";
import * as React from "react";

export interface ChartTooltipProps {
  /** Координаты внутри обёртки графика, уже с учётом отступов. */
  x: number;
  y: number;
  width: number;
  height: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Тултип переворачивается у краёв по положению курсора, без замера самого
 * блока: у правого края уходит влево, у нижнего — вверх.
 */
export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  x,
  y,
  width,
  height,
  className,
  children,
}) => {
  const flipX = x > width / 2;

  const shiftY =
    y < height / 3 ? "0%" : y > (height * 2) / 3 ? "-100%" : "-50%";

  return (
    <div
      role="tooltip"
      className={cn(
        "pointer-events-none absolute z-20 min-w-[9rem] rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-md",
        className,
      )}
      style={{
        left: x,
        top: y,
        transform: `translate(${flipX ? "calc(-100% - 12px)" : "12px"}, ${shiftY})`,
      }}
    >
      {children}
    </div>
  );
};
