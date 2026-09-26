import { Progress } from "@shared/ui";
import { FC } from "react";

import type { UploadProgress } from "../model/useUploadFile";

/** Имя, номер в пачке и доля отправленного для текущего файла. */
export const UploadStatus: FC<{ progress: UploadProgress }> = ({
  progress,
}) => {
  const percent =
    progress.ratio === undefined ? null : Math.round(progress.ratio * 100);

  return (
    <div
      className="flex flex-col gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-6"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 truncate font-medium">
          Загрузка {progress.name}
        </span>
        <span className="shrink-0 tabular-nums text-muted-foreground">
          {progress.count > 1 && `${progress.index} из ${progress.count} · `}
          {percent === null ? "…" : `${percent}%`}
        </span>
      </div>
      <Progress
        value={progress.ratio}
        indeterminate={progress.ratio === undefined}
        aria-label={`Загрузка ${progress.name}`}
      />
    </div>
  );
};
