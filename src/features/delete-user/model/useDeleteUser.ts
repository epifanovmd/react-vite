import { IMainApi } from "@shared/api";
import type { UserDto } from "@shared/api/gen/main/model";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { useConfirm } from "@shared/ui";

interface UseDeleteUserOptions {
  /** Пользователь удалён на сервере: обновить список (промис дожидается). */
  onDeleted: (user: UserDto) => unknown;
}

/** Удаление пользователя с подтверждением. Возвращает, удалён ли. */
export const useDeleteUser = ({ onDeleted }: UseDeleteUserOptions) => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();
  const confirm = useConfirm();

  return async (user: UserDto): Promise<boolean> => {
    const ok = await confirm({
      title: "Удалить пользователя?",
      description: user.email ?? user.username ?? user.id,
      confirmLabel: "Удалить",
      confirmVariant: "destructive",
    });

    if (!ok) return false;

    const res = await api.deleteUser(user.id);

    if (res.error) {
      notifyApiError(toast, res.error);

      return false;
    }

    await onDeleted(user);

    return true;
  };
};
