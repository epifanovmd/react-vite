import { IMainApi } from "@shared/api";
import type { ApiKeyDto } from "@shared/api/gen/main/model";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { useConfirm } from "@shared/ui";

interface UseRevokeApiKeyOptions {
  /** Ключ отозван на сервере: обновить список (промис дожидается). */
  onRevoked: (key: ApiKeyDto) => unknown;
}

/** Отзыв API-ключа с подтверждением. Возвращает, отозван ли. */
export const useRevokeApiKey = ({ onRevoked }: UseRevokeApiKeyOptions) => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();
  const confirm = useConfirm();

  return async (key: ApiKeyDto): Promise<boolean> => {
    const ok = await confirm({
      title: `Отозвать ключ ${key.name}?`,
      description: "Клиенты с этим ключом сразу потеряют доступ.",
      confirmLabel: "Отозвать",
      confirmVariant: "destructive",
    });

    if (!ok) return false;

    const res = await api.revokeApiKey(key.id);

    if (res.error) {
      notifyApiError(toast, res.error);

      return false;
    }

    await onRevoked(key);

    return true;
  };
};
