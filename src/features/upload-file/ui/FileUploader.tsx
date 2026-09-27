import type { IFileDto } from "@shared/api/gen/main/model";
import { FileDrop, Segmented } from "@shared/ui";
import { FC } from "react";

import {
  UPLOAD_MODE_OPTIONS,
  UploadMode,
  useUploadFile,
} from "../model/useUploadFile";
import { UploadStatus } from "./UploadStatus";

interface FileUploaderProps {
  onUploaded: (file: IFileDto) => void;
}

/** Область загрузки файлов с выбором способа (через API или напрямую) и прогрессом. */
export const FileUploader: FC<FileUploaderProps> = ({ onUploaded }) => {
  const { mode, setMode, progress, upload } = useUploadFile({ onUploaded });

  return (
    <div className="flex flex-col gap-3">
      <Segmented<UploadMode>
        size="sm"
        options={UPLOAD_MODE_OPTIONS}
        value={mode}
        onValueChange={setMode}
        disabled={progress !== null}
      />
      {progress ? (
        <UploadStatus progress={progress} />
      ) : (
        <FileDrop
          multiple
          onFiles={files => upload(files).then()}
          title="Перетащите файлы или нажмите, чтобы выбрать"
          hint="Изображения, документы, аудио и видео до 100 МБ"
        />
      )}
    </div>
  );
};
