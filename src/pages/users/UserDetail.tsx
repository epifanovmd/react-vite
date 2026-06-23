import { PageHeader, PageLayout } from "@components/layouts";
import { UserInfoCard } from "@components/shared";
import { PageLoader } from "@components/shared/loaders";
import {
  AsyncIconButton,
  Badge,
  Button,
  Card,
  IconButton,
  PageEmpty,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/ui";
import { ArrowLeft, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { EditUserModal } from "./EditUserModal";
import { useUserDetailVM } from "./hooks";
import { UserPrivilegesModal } from "./UserPrivilegesModal";

interface UserDetailProps {
  userId: string;
  onBack: () => void;
}

const Row: FC<{ label: string; value?: string | null }> = ({
  label,
  value,
}) => (
  <div className="flex items-center justify-between gap-4 py-1.5">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm text-foreground text-right">{value || "—"}</span>
  </div>
);

export const UserDetail: FC<UserDetailProps> = observer(
  ({ userId, onBack }) => {
    const vm = useUserDetailVM({ userId, onBack });
    const user = vm.user;

    return (
      <PageLayout
        header={
          <PageHeader
            title={vm.model?.displayName ?? "Пользователь"}
            subtitle="Просмотр и управление пользователем"
            actions={
              <div className="flex items-center gap-2">
                <IconButton variant="ghost" onClick={onBack} title="Назад">
                  <ArrowLeft size={16} />
                </IconButton>
                {!vm.isLoading && user && (
                  <>
                    <IconButton
                      title="Редактировать"
                      onClick={() => vm.setEditOpen(true)}
                    >
                      <Pencil size={15} />
                    </IconButton>
                    <AsyncIconButton
                      title="Удалить"
                      variant="destructive"
                      onClick={vm.handleDeleteUser}
                    >
                      <Trash2 size={15} />
                    </AsyncIconButton>
                  </>
                )}
              </div>
            }
          />
        }
      >
        {vm.isLoading ? (
          <PageLoader />
        ) : !user ? (
          <PageEmpty icon="question" title="Пользователь не найден" />
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <div className="w-full flex-shrink-0 sm:w-64">
              <UserInfoCard
                displayName={vm.model?.displayName ?? "?"}
                login={vm.model?.login}
                role={user.roles.map(r => String(r.name)).join(", ") || undefined}
                emailVerified={vm.model?.emailVerified}
                registeredAt={vm.model?.createdAt}
                lastOnline={vm.model?.lastOnline}
              />
            </div>

            <div className="min-w-0 flex-1">
              <Tabs defaultValue="overview">
                <TabsList variant="underline">
                  <TabsTrigger value="overview" variant="underline">
                    Обзор
                  </TabsTrigger>
                  <TabsTrigger value="access" variant="underline">
                    Доступ
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="pt-4">
                  <Card title="Учётная запись" className="p-5">
                    <div className="flex flex-col divide-y divide-border">
                      <Row label="Email" value={user.email} />
                      <Row label="Телефон" value={user.phone} />
                      <Row label="Username" value={user.username} />
                      <Row label="ID" value={user.id} />
                      <Row label="Зарегистрирован" value={vm.model?.createdAt} />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<Pencil size={14} />}
                        onClick={() => vm.setEditOpen(true)}
                      >
                        Редактировать
                      </Button>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="access" className="pt-4">
                  <Card title="Права доступа" className="p-5">
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Роли
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {user.roles.length ? (
                            user.roles.map(r => (
                              <Badge key={r.id} variant="secondary" size="sm">
                                {String(r.name)}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Нет ролей
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Прямые разрешения
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {user.directPermissions.length ? (
                            user.directPermissions.map(p => (
                              <Badge key={p.id} variant="gray" size="sm">
                                {String(p.name)}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Нет прямых разрешений
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          leftIcon={<ShieldCheck size={14} />}
                          onClick={() => vm.setPrivilegesOpen(true)}
                        >
                          Управлять правами
                        </Button>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <EditUserModal
              open={vm.editOpen}
              user={user}
              onClose={() => vm.setEditOpen(false)}
            />
            <UserPrivilegesModal
              open={vm.privilegesOpen}
              user={user}
              onClose={() => vm.setPrivilegesOpen(false)}
            />
          </div>
        )}
      </PageLayout>
    );
  },
);
