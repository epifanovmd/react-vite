import { Progress } from "@shared/ui";
import { FC } from "react";

import { describeUpload } from "../model/upload-status";
import type { UploadProgress } from "../model/useUploadFile";

/** Текущий файл: имя, номер в пачке и стадия — отправка или обработка на сервере. */
export const UploadStatus: FC<{ progress: UploadProgress }> = ({
  progress,
}) => {
  const view = describeUpload(progress);

  return (
    <div
      className="flex flex-col gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-6"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 truncate font-medium">{view.title}</span>
        <span className="shrink-0 tabular-nums text-muted-foreground">
          {view.detail}
        </span>
      </div>
      <Progress
        value={progress.ratio}
        indeterminate={view.indeterminate}
        aria-label={view.title}
      />
    </div>
  );
};
