import { IMainApi } from "@shared/api";
import type { IFileDto } from "@shared/api/gen/main/model";
import type { IApiResponse } from "@shared/lib/holders";
import { INotificationService } from "@shared/lib/notifications";
import { useState } from "react";

/** `regular` — файл идёт через API; `direct` — прямо в хранилище по подписанной ссылке. */
export type UploadMode = "regular" | "direct";

export const UPLOAD_MODE_OPTIONS = [
  { value: "regular" as const, label: "Через API" },
  { value: "direct" as const, label: "Напрямую" },
];

interface UseUploadFileOptions {
  onUploaded: (file: IFileDto) => void;
}

export const useUploadFile = ({ onUploaded }: UseUploadFileOptions) => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();
  const [mode, setMode] = useState<UploadMode>("regular");
  const [uploading, setUploading] = useState<string | null>(null);

  const uploadRegular = async (file: File): Promise<IApiResponse<IFileDto>> => {
    const res = await api.uploadFile({ file });

    return { data: res.data?.[0] ?? null, error: res.error };
  };

  const uploadDirect = async (file: File): Promise<IApiResponse<IFileDto>> => {
    const target = await api.createUpload({
      name: file.name,
      size: file.size,
      contentType: file.type || "application/octet-stream",
    });

    if (!target.data) return { data: null, error: target.error };

    const put = await fetch(target.data.uploadUrl, {
      method: "PUT",
      headers: target.data.headers,
      body: file,
    }).catch(() => null);

    if (!put?.ok) {
      toast.error(`Хранилище не приняло файл ${file.name}`);

      return { data: null, error: { message: "Загрузка не удалась" } };
    }

    return api.completeUpload(target.data.fileId);
  };

  const upload = async (files: File[]) => {
    for (const file of files) {
      setUploading(file.name);

      const res =
        mode === "direct"
          ? await uploadDirect(file)
          : await uploadRegular(file);

      if (res.data) onUploaded(res.data);
    }

    setUploading(null);
  };

  return { mode, setMode, uploading, upload };
};
