import type { ChartReferenceLine } from "../chart.types";
import type { ChartModel } from "../hooks/use-chart-model";

export interface ChartReferenceLinesProps<Datum> {
  model: ChartModel<Datum>;
  lines: ChartReferenceLine[];
  innerWidth: number;
  innerHeight: number;
}

/** Целевые и пороговые линии: подписаны прямо, без легенды. */
export const ChartReferenceLines = <Datum,>({
  model,
  lines,
  innerWidth,
  innerHeight,
}: ChartReferenceLinesProps<Datum>) => (
  <g pointerEvents="none">
    {lines.map((line, index) => {
      const horizontal = line.y !== undefined;

      const position = horizontal
        ? model.yScale(line.y!)
        : model.positions[line.xIndex ?? 0];

      if (position === undefined || Number.isNaN(position)) {
        return null;
      }

      const color = line.color ?? "var(--muted-foreground)";

      return (
        <g key={`${line.label ?? "reference"}-${index}`}>
          <line
            x1={horizontal ? 0 : position}
            x2={horizontal ? innerWidth : position}
            y1={horizontal ? position : 0}
            y2={horizontal ? position : innerHeight}
            stroke={color}
            strokeWidth={1}
            strokeDasharray={line.dashed === false ? undefined : "4 4"}
            opacity={0.8}
          />

          {line.label && (
            <text
              x={horizontal ? innerWidth : position + 4}
              y={horizontal ? position - 6 : 10}
              textAnchor={horizontal ? "end" : "start"}
              fill="var(--muted-foreground)"
              fontSize={10}
              fontFamily="inherit"
            >
              {line.label}
            </text>
          )}
        </g>
      );
    })}
  </g>
);
