import type { UploadProgress } from "./useUploadFile";

export interface UploadStatusView {
  title: string;
  /** Справа: номер в пачке и процент либо стадия. */
  detail: string;
  /** Бегущая полоса: доля неизвестна или файл уже у сервера. */
  indeterminate: boolean;
}

/**
 * Что показать о загрузке. Отправив файл целиком, клиент ждёт ответа, пока
 * сервер проверяет и сохраняет его, — это отдельная стадия, а не «висит на 100%».
 */
export const describeUpload = (progress: UploadProgress): UploadStatusView => {
  const position =
    progress.count > 1 ? `${progress.index} из ${progress.count} · ` : "";

  if (progress.ratio !== undefined && progress.ratio >= 1) {
    return {
      title: `Обработка ${progress.name}`,
      detail: `${position}на сервере…`,
      indeterminate: true,
    };
  }

  return {
    title: `Загрузка ${progress.name}`,
    detail:
      position +
      (progress.ratio === undefined
        ? "…"
        : `${Math.round(progress.ratio * 100)}%`),
    indeterminate: progress.ratio === undefined,
  };
};
