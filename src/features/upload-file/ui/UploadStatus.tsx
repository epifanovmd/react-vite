import { Progress } from "@shared/ui";
import { FC } from "react";

import { describeUpload } from "../model/upload-status";
import type { UploadProgress } from "../model/useUploadFile";

/** Стадия загрузки текущего файла, номер в пачке и имя файла. */
export const UploadStatus: FC<{ progress: UploadProgress }> = ({
  progress,
}) => {
  const view = describeUpload(progress);

  return (
    <div
      className="flex flex-col gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-5"
      aria-live="polite"
    >
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium tabular-nums">{view.stage}</span>
        {view.position && (
          <span className="shrink-0 tabular-nums text-muted-foreground">
            {view.position}
          </span>
        )}
      </div>
      <Progress
        value={progress.ratio}
        indeterminate={view.indeterminate}
        aria-label={`${view.stage} ${progress.name}`}
      />
      <span className="truncate text-xs text-muted-foreground">
        {progress.name}
      </span>
    </div>
  );
};
