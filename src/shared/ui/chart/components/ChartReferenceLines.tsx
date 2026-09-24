import { Line } from "@visx/shape";
import { useId } from "react";

import type { ChartReferenceLine } from "../chart.types";
import { useChartScales } from "../hooks/chart-scales-context";
import { ANNOTATION_COLOR } from "../utils/annotations";
import { ChartPlotClip } from "./ChartPlotClip";

export interface ChartReferenceLinesProps {
  lines: ChartReferenceLine[];
}

interface ResolvedLine {
  key: string;
  axis: "x" | "y";
  from: { x: number; y: number };
  to: { x: number; y: number };
  label: ChartReferenceLine["label"];
  labelX: number;
  labelY: number;
  anchor: "start" | "end";
  color: string;
  dashed: boolean;
}

const DASH = "4,4";

const LABEL_OFFSET = 4;

const LABEL_TOP = 12;

const LABEL_STYLE = { fontSize: 11, fontFamily: "inherit" } as const;

/** Подпись над линией, а у самого верха области — под ней, иначе её обрежет. */
const labelYFor = (y: number) =>
  y < LABEL_TOP + LABEL_OFFSET ? y + LABEL_TOP : y - LABEL_OFFSET;

/** Опорные линии поверх серий; подпись — у правого края или у верха линии. */
export const ChartReferenceLines = ({ lines }: ChartReferenceLinesProps) => {
  const { yScale, xToPosition, innerWidth, innerHeight } = useChartScales();
  const clipId = useId();

  const resolved = lines.flatMap<ResolvedLine>((line, index) => {
    const color = ANNOTATION_COLOR[line.variant ?? "default"];
    const dashed = line.dashed ?? false;

    if (line.y !== undefined) {
      const y = yScale(line.y);

      return [
        {
          key: `y-${index}`,
          axis: "y",
          from: { x: 0, y },
          to: { x: innerWidth, y },
          label: line.label,
          labelX: innerWidth - LABEL_OFFSET,
          labelY: labelYFor(y),
          anchor: "end",
          color,
          dashed,
        },
      ];
    }

    const x = line.x === undefined ? undefined : xToPosition(line.x);

    if (x === undefined || !Number.isFinite(x)) return [];

    return [
      {
        key: `x-${index}`,
        axis: "x",
        from: { x, y: 0 },
        to: { x, y: innerHeight },
        label: line.label,
        labelX: x + LABEL_OFFSET,
        labelY: LABEL_TOP,
        anchor: "start",
        color,
        dashed,
      },
    ];
  });

  if (resolved.length === 0) return null;

  return (
    <g pointerEvents="none">
      <ChartPlotClip id={clipId} />
      <g clipPath={`url(#${clipId})`}>
        {resolved.map(item => (
          <g key={item.key} data-chart-reference={item.axis}>
            <Line
              from={item.from}
              to={item.to}
              stroke={item.color}
              strokeWidth={1.5}
              strokeDasharray={item.dashed ? DASH : undefined}
            />
            {item.label !== undefined && (
              <text
                x={item.labelX}
                y={item.labelY}
                textAnchor={item.anchor}
                fill={item.color}
                style={LABEL_STYLE}
              >
                {item.label}
              </text>
            )}
          </g>
        ))}
      </g>
    </g>
  );
};
