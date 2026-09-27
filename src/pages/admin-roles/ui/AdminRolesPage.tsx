import { PermissionGate } from "@entities/user";
import { KnownPermission } from "@shared/api/gen/main/model";
import {
  Button,
  Card,
  Form,
  InputFormField,
  PageHeader,
  PageLayout,
  Skeleton,
} from "@shared/ui";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { TNewRoleForm, useAdminRolesVM } from "../model/useAdminRolesVM";
import { RolePermissionsCard } from "./RolePermissionsCard";

const header = (
  <PageHeader title="Роли" subtitle="Наборы прав для пользователей" />
);

const AdminRolesContent: FC = observer(() => {
  const vm = useAdminRolesVM();

  return (
    <>
      {vm.canManage && (
        <Card title="Новая роль">
          <Form
            form={vm.form}
            onSubmit={vm.create}
            className="flex flex-col gap-3"
          >
            <InputFormField<TNewRoleForm>
              name="name"
              label="Название"
              placeholder="moderator"
            />
            <Button
              type="submit"
              className="self-start"
              leftIcon={<Plus size={15} />}
              loading={vm.form.formState.isSubmitting}
            >
              Создать
            </Button>
          </Form>
        </Card>
      )}
      {vm.isLoading && vm.roles.length === 0 ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {vm.roles.map(role => (
            <RolePermissionsCard
              key={role.id}
              role={role}
              canManage={vm.canManage}
              onSave={vm.savePermissions}
              onDelete={vm.remove}
            />
          ))}
        </div>
      )}
    </>
  );
});

export const AdminRolesPage: FC = () => (
  <PageLayout header={header}>
    <PermissionGate permission={KnownPermission["role:view"]}>
      <AdminRolesContent />
    </PermissionGate>
  </PageLayout>
);
