import { ADMIN_PERMISSIONS, PermissionGate, UserAvatar } from "@entities/user";
import { EditUserPrivilegesModal } from "@features/edit-user-privileges";
import type { UserDto } from "@shared/api/gen/main/model";
import { useLatestRef } from "@shared/lib/hooks";
import { formatter } from "@shared/lib/utils";
import {
  Badge,
  createColumnHelper,
  Empty,
  IconButton,
  Input,
  PageHeader,
  PageLayout,
  Pagination,
  Table,
} from "@shared/ui";
import { useNavigate } from "@tanstack/react-router";
import { Search, ShieldCheck, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, type RefObject, useMemo } from "react";

import { type AdminUsersVM, useAdminUsersVM } from "../model/useAdminUsersVM";

interface ColumnActions {
  /** VM — через ref: колонки стабильны, ячейки не перемонтируются. */
  vm: RefObject<AdminUsersVM>;
  canEditPrivileges: boolean;
  canDelete: boolean;
  currentUserId?: string;
}

const column = createColumnHelper<UserDto>();

const displayName = (user: UserDto): string =>
  [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(" ") ||
  user.username ||
  user.email ||
  user.phone ||
  "Без имени";

const createColumns = ({
  vm,
  canEditPrivileges,
  canDelete,
  currentUserId,
}: ColumnActions) => [
  column.display({
    id: "user",
    header: "Пользователь",
    cell: ({ row }) => {
      const user = row.original;
      const name = displayName(user);

      return (
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar
            name={name}
            src={user.profile?.avatar?.thumbnailUrl ?? undefined}
            size="md"
          />
          <div className="min-w-0">
            <p className="truncate font-medium">{name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email ?? user.phone ?? "—"}
              {user.username && ` · @${user.username}`}
            </p>
          </div>
        </div>
      );
    },
  }),
  column.display({
    id: "roles",
    header: "Роли и права",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.roles.map(role => (
          <Badge key={role.id} variant="secondary">
            {role.name}
          </Badge>
        ))}
        {row.original.directPermissions.map(p => (
          <Badge key={p.id} variant="outline">
            {p.name}
          </Badge>
        ))}
      </div>
    ),
  }),
  column.accessor("createdAt", {
    header: "Регистрация",
    size: 170,
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {formatter.date.formatDate(getValue())}
      </span>
    ),
  }),
  column.display({
    id: "actions",
    size: 100,
    meta: { align: "right" },
    cell: ({ row }) =>
      row.original.id !== currentUserId && (canEditPrivileges || canDelete) ? (
        <div className="flex justify-end gap-1">
          {canEditPrivileges && (
            <IconButton
              aria-label="Права"
              onClick={() => vm.current.edit(row.original)}
            >
              <ShieldCheck size={15} />
            </IconButton>
          )}
          {canDelete && (
            <IconButton
              aria-label="Удалить"
              variant="destructive"
              onClick={() => void vm.current.remove(row.original)}
            >
              <Trash2 size={15} />
            </IconButton>
          )}
        </div>
      ) : null,
  }),
];

const header = (
  <PageHeader title="Пользователи" subtitle="Учётные записи и их права" />
);

const AdminUsersContent: FC = observer(() => {
  const vm = useAdminUsersVM();
  const { users, canEditPrivileges, canDelete, currentUserId } = vm;
  const vmRef = useLatestRef(vm);
  // Права и текущий пользователь меняют только колонку действий.
  const columns = useMemo(
    () =>
      createColumns({ vm: vmRef, canEditPrivileges, canDelete, currentUserId }),
    [vmRef, canEditPrivileges, canDelete, currentUserId],
  );

  return (
    <>
      <Input
        value={vm.search}
        onChange={e => vm.setSearch(e.target.value)}
        placeholder="Поиск по email, имени, username"
        leftAddon={<Search size={15} />}
        className="w-full sm:w-80"
        clearable
        onClear={() => vm.setSearch("")}
      />
      <Table
        className="min-h-0 flex-initial"
        stickyHeader
        data={users.items}
        columns={columns}
        loading={users.isLoading}
        refreshing={users.isRefreshing}
        error={
          users.error ? (
            <Empty size="sm" icon="error" title={users.error.message} />
          ) : undefined
        }
        labels={{ empty: "Пользователи не найдены" }}
        getRowId={u => u.id}
        aria-label="Пользователи"
      />
      {users.pageCount > 1 && (
        <Pagination
          className="shrink-0 self-center"
          currentPage={users.pagination.page}
          totalPages={users.pageCount}
          disabled={users.isBusy}
          onPageChange={page => users.goToPage(page).then()}
        />
      )}
      <EditUserPrivilegesModal
        user={vm.editing}
        onClose={vm.closeEdit}
        onSaved={vm.onSaved}
      />
    </>
  );
});

export const AdminUsersPage: FC = () => {
  const navigate = useNavigate();

  return (
    <PageLayout header={header} fill>
      <PermissionGate
        permission={ADMIN_PERMISSIONS.USER_VIEW}
        onDenied={() => void navigate({ to: "/", replace: true })}
      >
        <AdminUsersContent />
      </PermissionGate>
    </PageLayout>
  );
};
