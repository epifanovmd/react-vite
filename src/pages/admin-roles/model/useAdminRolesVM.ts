import { IUserStore } from "@entities/user";
import { IMainApi } from "@shared/api";
import { type IRoleDto, KnownPermission } from "@shared/api/gen/main/model";
import { useCollection } from "@shared/lib/holders";
import { INotificationService } from "@shared/lib/notifications";
import { useConfirm, useZodForm } from "@shared/ui";
import { useEffect } from "react";
import { z } from "zod";

export const newRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, "Не длиннее 100 символов.")
    .regex(
      /^[a-z][a-z0-9_-]*$/,
      "Строчная латиница, цифры, - и _; начинается с буквы.",
    ),
});

export type TNewRoleForm = z.infer<typeof newRoleSchema>;

export const useAdminRolesVM = () => {
  const api = IMainApi.useInstance();
  const userStore = IUserStore.useInstance();
  const toast = INotificationService.useInstance();
  const confirm = useConfirm();
  const form = useZodForm(newRoleSchema, { defaultValues: { name: "" } });

  const roles = useCollection<IRoleDto>({
    queryFn: () => api.getRoles(),
    keyExtractor: r => r.id,
  });

  useEffect(() => {
    roles.load().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = async ({ name }: TNewRoleForm) => {
    const res = await api.createRole({ name });

    if (!res.data) return;

    roles.appendItem(res.data);
    form.reset({ name: "" });
    toast.success(`Роль ${name} создана`);
  };

  const savePermissions = async (role: IRoleDto, permissions: string[]) => {
    const res = await api.setRolePermissions(role.id, { permissions });

    if (!res.data) return false;

    roles.updateItem(role.id, res.data);
    toast.success(`Права роли ${role.name} сохранены`);

    return true;
  };

  const remove = async (role: IRoleDto) => {
    const ok = await confirm({
      title: `Удалить роль ${role.name}?`,
      description: "Пользователи потеряют права этой роли.",
      confirmLabel: "Удалить",
      confirmVariant: "destructive",
    });

    if (!ok) return;

    const res = await api.deleteRole(role.id);

    if (!res.error) roles.removeItem(role.id);
  };

  return {
    roles: roles.items,
    isLoading: roles.isLoading,
    canManage: userStore.can(KnownPermission["role:manage"]),
    form,
    create,
    savePermissions,
    remove,
  };
};
