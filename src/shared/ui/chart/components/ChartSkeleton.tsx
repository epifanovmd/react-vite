/** Пока данные едут, место графика держит форму — без скачка лейаута. */
const BAR_HEIGHTS = [0.45, 0.7, 0.35, 0.85, 0.55, 0.75, 0.4];

export const ChartSkeleton = () => (
  <div className="flex h-full w-full items-end gap-2 px-2 pb-6">
    {BAR_HEIGHTS.map((part, index) => (
      <div
        key={index}
        className="flex-1 animate-pulse rounded-t-md bg-muted"
        style={{ height: `${part * 100}%` }}
      />
    ))}
  </div>
);
