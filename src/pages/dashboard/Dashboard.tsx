import { PageHeader, PageLayout } from "@components/layouts";
import { Badge, Card, StatCard } from "@components/ui";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  LayoutGrid,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { useDashboardVM } from "./hooks/useDashboardVM";

const QUICK_LINKS = [
  {
    to: "/users",
    label: "Пользователи",
    description: "Управление пользователями и правами",
    icon: Users,
  },
  {
    to: "/profile",
    label: "Профиль",
    description: "Личные данные и безопасность",
    icon: User,
  },
  {
    to: "/ui",
    label: "UI Kit",
    description: "Библиотека компонентов",
    icon: LayoutGrid,
  },
] as const;

export const Dashboard: FC = observer(() => {
  const vm = useDashboardVM();

  return (
    <PageLayout
      header={
        <PageHeader
          title="Дашборд"
          subtitle={`Добро пожаловать, ${vm.displayName}`}
        />
      }
    >
      <div className="flex flex-col gap-3 sm:gap-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          <StatCard
            title="Пользователей"
            value={vm.usersLoading ? "…" : vm.totalUsers}
            subtitle="Всего в системе"
            color="info"
            icon={<Users size={20} />}
          />
          <StatCard
            title="Роль"
            value={vm.role ?? "—"}
            subtitle="Ваша роль в системе"
            color="purple"
            icon={<ShieldCheck size={20} />}
          />
          <StatCard
            title="Email"
            value={vm.emailVerified ? "Подтверждён" : "Не подтверждён"}
            subtitle="Статус верификации"
            color={vm.emailVerified ? "success" : "warning"}
            icon={<User size={20} />}
          />
          <StatCard
            title="Регистрация"
            value={vm.registeredAt ?? "—"}
            subtitle="Дата создания аккаунта"
            color="default"
            icon={<CalendarDays size={20} />}
          />
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              Быстрый доступ
            </p>
            <Badge size="sm" variant="secondary">
              {QUICK_LINKS.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {QUICK_LINKS.map(({ to, label, description, icon: Icon }) => (
              <Link key={to} to={to}>
                <Card className="group h-full p-4 transition-colors hover:border-brand">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {label}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
});
