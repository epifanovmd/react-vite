import { IMainApi } from "@shared/api";
import type { IRoleDto } from "@shared/api/gen/main/model";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";

interface UseSaveRolePermissionsOptions {
  /** Права сохранены: роль в ответе сервера. */
  onSaved: (role: IRoleDto) => void;
}

/** Сохранение набора прав роли. Возвращает, сохранено ли. */
export const useSaveRolePermissions = ({
  onSaved,
}: UseSaveRolePermissionsOptions) => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();

  return async (role: IRoleDto, permissions: string[]): Promise<boolean> => {
    const res = await api.setRolePermissions(role.id, { permissions });

    if (!res.data) {
      notifyApiError(toast, res.error);

      return false;
    }

    onSaved(res.data);
    toast.success(`Права роли ${role.name} сохранены`);

    return true;
  };
};
