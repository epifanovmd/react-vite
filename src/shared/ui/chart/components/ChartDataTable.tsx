import { cn } from "@shared/lib/utils/cn";

import type { ChartResolvedSeries } from "../chart.types";

export interface ChartDataTableProps<Datum> {
  series: ChartResolvedSeries<Datum>[];
  labels: string[];
  visible: boolean;
  caption?: string;
}

/**
 * Те же значения текстом: тултип дополняет график, но ничего не запирает —
 * с клавиатуры, при слабом различении цветов и на печати остаётся таблица.
 */
export const ChartDataTable = <Datum,>({
  series,
  labels,
  visible,
  caption,
}: ChartDataTableProps<Datum>) => (
  <div className={cn(visible ? "overflow-x-auto" : "sr-only")}>
    <table className="w-full text-xs">
      <caption className="sr-only">{caption ?? "Данные графика"}</caption>
      <thead>
        <tr className="border-b text-muted-foreground">
          <th scope="col" className="py-1.5 pr-3 text-left font-medium">
            Позиция
          </th>
          {series.map(item => (
            <th
              key={item.key}
              scope="col"
              className="py-1.5 pl-3 text-right font-medium"
            >
              {item.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {labels.map((label, index) => (
          <tr key={label + index} className="border-b last:border-0">
            <th scope="row" className="py-1.5 pr-3 text-left font-normal">
              {label}
            </th>
            {series.map(item => {
              const point = item.points[index];

              return (
                <td
                  key={item.key}
                  className="py-1.5 pl-3 text-right tabular-nums"
                >
                  {point?.value === null || point === undefined
                    ? "—"
                    : item.format(point.value)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
