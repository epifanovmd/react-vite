import { localPoint } from "@visx/event";
import * as React from "react";

export interface ChartOverlayPoint {
  x: number;
  y: number;
}

export interface ChartOverlayProps {
  width: number;
  height: number;
  marginLeft: number;
  marginTop: number;
  positions: number[];
  activeIndex: number | null;
  onActive: (index: number | null, point: ChartOverlayPoint | null) => void;
  onSelect?: (index: number) => void;
  ariaLabel?: string;
}

const nearestIndex = (positions: number[], x: number): number | null => {
  if (positions.length === 0) {
    return null;
  }

  let low = 0;
  let high = positions.length - 1;

  while (high - low > 1) {
    const middle = Math.floor((low + high) / 2);

    if (positions[middle] > x) {
      high = middle;
    } else {
      low = middle;
    }
  }

  return Math.abs(positions[low] - x) <= Math.abs(positions[high] - x)
    ? low
    : high;
};

/**
 * Зона наведения шире любой марки: курсору достаточно быть ближайшим к
 * позиции, а не попасть в саму точку. С клавиатуры — те же значения.
 */
export const ChartOverlay: React.FC<ChartOverlayProps> = ({
  width,
  height,
  marginLeft,
  marginTop,
  positions,
  activeIndex,
  onActive,
  onSelect,
  ariaLabel,
}) => {
  const handleMove = (
    event:
      React.PointerEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>,
  ) => {
    const point = localPoint(event);

    if (!point) {
      return;
    }

    const x = point.x - marginLeft;
    const index = nearestIndex(positions, x);

    if (index === null) {
      return;
    }

    onActive(index, { x: positions[index], y: point.y - marginTop });
  };

  const move = (delta: number) => {
    const next = Math.min(
      positions.length - 1,
      Math.max(0, (activeIndex ?? 0) + delta),
    );

    onActive(next, { x: positions[next], y: height / 2 });
  };

  const handleKeyDown = (event: React.KeyboardEvent<SVGRectElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const index = event.key === "Home" ? 0 : positions.length - 1;

      onActive(index, { x: positions[index], y: height / 2 });
    }

    if (event.key === "Escape") {
      onActive(null, null);
    }

    if ((event.key === "Enter" || event.key === " ") && activeIndex !== null) {
      event.preventDefault();
      onSelect?.(activeIndex);
    }
  };

  return (
    <rect
      width={Math.max(0, width)}
      height={Math.max(0, height)}
      fill="transparent"
      tabIndex={0}
      role="application"
      aria-label={ariaLabel}
      className="outline-none"
      onPointerMove={handleMove}
      onPointerDown={handleMove}
      onPointerLeave={() => onActive(null, null)}
      onFocus={() => move(0)}
      onBlur={() => onActive(null, null)}
      onKeyDown={handleKeyDown}
      onClick={() => activeIndex !== null && onSelect?.(activeIndex)}
    />
  );
};
