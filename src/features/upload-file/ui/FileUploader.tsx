import type { IFileDto } from "@shared/api/gen/main/model";
import { FileDrop, Segmented, Spinner } from "@shared/ui";
import { FC } from "react";

import {
  UPLOAD_MODE_OPTIONS,
  UploadMode,
  useUploadFile,
} from "../model/useUploadFile";

interface FileUploaderProps {
  onUploaded: (file: IFileDto) => void;
}

/** Область загрузки файлов с выбором способа: через API или напрямую. */
export const FileUploader: FC<FileUploaderProps> = ({ onUploaded }) => {
  const { mode, setMode, uploading, upload } = useUploadFile({ onUploaded });

  return (
    <div className="flex flex-col gap-3">
      <Segmented<UploadMode>
        size="sm"
        options={UPLOAD_MODE_OPTIONS}
        value={mode}
        onValueChange={setMode}
        disabled={uploading !== null}
      />
      <FileDrop
        multiple
        disabled={uploading !== null}
        onFiles={files => upload(files).then()}
        title={
          uploading ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" /> Загрузка {uploading}…
            </span>
          ) : (
            "Перетащите файлы или нажмите, чтобы выбрать"
          )
        }
        hint="Изображения, документы, аудио и видео до 100 МБ"
      />
    </div>
  );
};
