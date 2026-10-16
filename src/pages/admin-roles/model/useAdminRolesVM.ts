import { ADMIN_PERMISSIONS, ALL_PERMISSIONS, IUserStore } from "@entities/user";
import {
  useCreateRoleVM,
  useDeleteRole,
  useSaveRolePermissions,
} from "@features/manage-roles";
import { IMainApi } from "@shared/api";
import type { IRoleDto } from "@shared/api/gen/main/model";
import { useCollection } from "@shared/lib/holders";
import { useSocketEvent, useSocketRoom } from "@shared/lib/socket";

/** Схема и тип формы новой роли — из `features/manage-roles`. */
export { newRoleSchema, type TNewRoleForm } from "@features/manage-roles";

export const useAdminRolesVM = () => {
  const api = IMainApi.useInstance();
  const userStore = IUserStore.useInstance();

  const canView = userStore.can(ADMIN_PERMISSIONS.ROLE_VIEW);

  const roles = useCollection<IRoleDto>({
    queryFn: () => api.getRoles(),
    keyExtractor: r => r.id,
    autoLoad: true,
    enabled: canView,
  });

  useSocketRoom("roles", canView ? "all" : null, () => roles.refresh());
  useSocketEvent<[IRoleDto]>(
    "role:updated",
    role => roles.upsertItem(role.id, role),
    canView,
  );
  useSocketEvent<[{ id: string }]>(
    "role:deleted",
    ({ id }) => roles.removeItem(id),
    canView,
  );

  const { form, create } = useCreateRoleVM({
    onCreated: role => roles.upsertItem(role.id, role),
  });
  const savePermissions = useSaveRolePermissions({
    onSaved: role => roles.updateItem(role.id, role),
  });
  const remove = useDeleteRole({
    onDeleted: role => roles.removeItem(role.id),
  });

  return {
    roles: roles.items,
    isLoading: roles.isLoading,
    canCreate: userStore.can(ADMIN_PERMISSIONS.ROLE_CREATE),
    canUpdate: userStore.can(ADMIN_PERMISSIONS.ROLE_UPDATE),
    canDelete: userStore.can(ADMIN_PERMISSIONS.ROLE_DELETE),
    isSuperUser: userStore.isAdmin || userStore.can(ALL_PERMISSIONS),
    form,
    create,
    savePermissions,
    remove,
  };
};
