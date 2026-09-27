import type { UploadProgress } from "./useUploadFile";

export interface UploadStatusView {
  /** Стадия целиком: «Загрузка 42%» или «Обработка на сервере…». */
  stage: string;
  /** Номер файла в пачке; `null` — файл один. */
  position: string | null;
  /** Бегущая полоса: доля неизвестна или файл уже у сервера. */
  indeterminate: boolean;
}

/**
 * Что показать о загрузке. Отправив файл целиком, клиент ждёт ответа, пока
 * сервер проверяет и сохраняет его, — это отдельная стадия, а не «висит на 100%».
 */
export const describeUpload = (progress: UploadProgress): UploadStatusView => {
  const position =
    progress.count > 1 ? `${progress.index} из ${progress.count}` : null;

  if (progress.ratio !== undefined && progress.ratio >= 1) {
    return { stage: "Обработка на сервере…", position, indeterminate: true };
  }

  return {
    stage:
      progress.ratio === undefined
        ? "Загрузка…"
        : `Загрузка ${Math.round(progress.ratio * 100)}%`,
    position,
    indeterminate: progress.ratio === undefined,
  };
};
