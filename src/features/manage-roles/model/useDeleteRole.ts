import { IMainApi } from "@shared/api";
import type { IRoleDto } from "@shared/api/gen/main/model";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { useConfirm } from "@shared/ui";

interface UseDeleteRoleOptions {
  /** Роль удалена на сервере: убрать из списка. */
  onDeleted: (role: IRoleDto) => void;
}

/** Удаление роли с подтверждением. Возвращает, удалена ли. */
export const useDeleteRole = ({ onDeleted }: UseDeleteRoleOptions) => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();
  const confirm = useConfirm();

  return async (role: IRoleDto): Promise<boolean> => {
    const ok = await confirm({
      title: `Удалить роль ${role.name}?`,
      description: "Пользователи потеряют права этой роли.",
      confirmLabel: "Удалить",
      confirmVariant: "destructive",
    });

    if (!ok) return false;

    const res = await api.deleteRole(role.id);

    if (res.error) {
      notifyApiError(toast, res.error);

      return false;
    }

    onDeleted(role);

    return true;
  };
};
