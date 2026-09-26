import { IMainApi } from "@shared/api";
import type { IFileDto } from "@shared/api/gen/main/model";
import type { IApiResponse } from "@shared/lib/holders";
import { createHttpClient, type HttpProgress } from "@shared/lib/http";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { useState } from "react";

/** `regular` — файл идёт через API; `direct` — прямо в хранилище по подписанной ссылке. */
export type UploadMode = "regular" | "direct";

export const UPLOAD_MODE_OPTIONS = [
  { value: "regular" as const, label: "Через API" },
  { value: "direct" as const, label: "Напрямую" },
];

/** Текущая загрузка: файл, его номер в пачке и доля отправленного. */
export interface UploadProgress {
  name: string;
  index: number;
  count: number;
  /** 0..1; `undefined` — размер неизвестен или ждём ответа сервера. */
  ratio?: number;
}

/**
 * Клиент для подписанной ссылки хранилища: без авторизации и тостов, адрес —
 * абсолютный. Нужен ради прогресса отправки, которого нет у `fetch`.
 */
const storageClient = createHttpClient({ baseUrl: "", timeout: 0 });

interface UseUploadFileOptions {
  onUploaded: (file: IFileDto) => void;
}

export const useUploadFile = ({ onUploaded }: UseUploadFileOptions) => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();
  const [mode, setMode] = useState<UploadMode>("regular");
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  const onUploadProgress = ({ ratio }: HttpProgress) =>
    setProgress(current => current && { ...current, ratio });

  const uploadRegular = async (file: File): Promise<IApiResponse<IFileDto>> => {
    const res = await api.uploadFile({ file }, { onUploadProgress });

    return { data: res.data?.[0] ?? null, error: res.error };
  };

  const uploadDirect = async (file: File): Promise<IApiResponse<IFileDto>> => {
    const target = await api.createUpload({
      name: file.name,
      size: file.size,
      contentType: file.type || "application/octet-stream",
    });

    if (!target.data) return { data: null, error: target.error };

    const put = await storageClient.request(
      {
        url: target.data.uploadUrl,
        method: "PUT",
        headers: target.data.headers,
        data: file,
      },
      { onUploadProgress },
    );

    if (put.error) {
      return {
        data: null,
        error: { message: `Хранилище не приняло файл ${file.name}` },
      };
    }

    return api.completeUpload(target.data.fileId);
  };

  const upload = async (files: File[]) => {
    for (const [index, file] of files.entries()) {
      setProgress({ name: file.name, index: index + 1, count: files.length });

      const res =
        mode === "direct"
          ? await uploadDirect(file)
          : await uploadRegular(file);

      if (res.data) {
        onUploaded(res.data);
      } else {
        notifyApiError(toast, res.error);
      }
    }

    setProgress(null);
  };

  return { mode, setMode, progress, upload };
};
