import { IMainApi } from "@shared/api";
import type { IFileDto } from "@shared/api/gen/main/model";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { useConfirm } from "@shared/ui";

interface UseDeleteFileOptions {
  /** Файл удалён на сервере: обновить список (промис дожидается). */
  onDeleted: (file: IFileDto) => unknown;
}

/** Удаление своего файла с подтверждением. Возвращает, удалён ли. */
export const useDeleteFile = ({ onDeleted }: UseDeleteFileOptions) => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();
  const confirm = useConfirm();

  return async (file: IFileDto): Promise<boolean> => {
    const ok = await confirm({
      title: "Удалить файл?",
      description: file.name,
      confirmLabel: "Удалить",
      confirmVariant: "destructive",
    });

    if (!ok) return false;

    const res = await api.deleteFile(file.id);

    if (res.error) {
      notifyApiError(toast, res.error);

      return false;
    }

    await onDeleted(file);

    return true;
  };
};
