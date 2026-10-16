import { IMainApi } from "@shared/api";
import type { IRoleDto } from "@shared/api/gen/main/model";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { useZodForm } from "@shared/ui";

import { newRoleSchema, type TNewRoleForm } from "./validation";

interface UseCreateRoleOptions {
  /** Роль создана: набор прав всегда есть (пустой у новой роли). */
  onCreated: (role: IRoleDto) => void;
}

/** Форма новой роли: создание, сброс формы и тост. */
export const useCreateRoleVM = ({ onCreated }: UseCreateRoleOptions) => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();
  const form = useZodForm(newRoleSchema, { defaultValues: { name: "" } });

  const create = async ({ name }: TNewRoleForm) => {
    const res = await api.createRole({ name });

    if (!res.data) {
      notifyApiError(toast, res.error);

      return;
    }

    // Сервер отдаёт только что созданную роль без поля permissions.
    onCreated({ ...res.data, permissions: res.data.permissions ?? [] });
    form.reset({ name: "" });
    toast.success(`Роль ${name} создана`);
  };

  return { form, create };
};
