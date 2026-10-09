import { AGENT_PERMISSIONS } from "@entities/agent";
import { NODE_PERMISSIONS } from "@entities/node";
import { ADMIN_PERMISSIONS, type Permission } from "@entities/user";
import { ownPermission } from "@shared/lib/access";
import { type LinkProps } from "@tanstack/react-router";
import {
  Activity,
  Cpu,
  FolderOpen,
  KeyRound,
  LayoutGrid,
  ListChecks,
  type LucideIcon,
  ScrollText,
  Server,
  Shield,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

export interface NavItem {
  to: LinkProps["to"];
  label: string;
  icon: LucideIcon;
  badge?: number;
  /** Пункт виден, только если есть право (из списка — любое). */
  permission?: Permission | Permission[];
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
  /** Группа есть только в мобильном меню: в шапке её пункты лежат в меню профиля. */
  mobileOnly?: boolean;
}

export const NAV_ICON_SIZE = 17;

/** Разделы аккаунта: в шапке — в меню профиля, на мобильном — группой. */
export const ACCOUNT_NAV_ITEMS: NavItem[] = [
  { to: "/security", label: "Безопасность", icon: Shield },
  { to: "/activity", label: "Мой журнал", icon: Activity },
];

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { to: "/profile", label: "Профиль", icon: User },
      { to: "/files", label: "Файлы", icon: FolderOpen },
      { to: "/jobs", label: "Задачи", icon: ListChecks },
      {
        to: "/nodes",
        label: "Узлы",
        icon: Server,
        permission: ownPermission(NODE_PERMISSIONS.VIEW),
      },
    ],
  },
  {
    label: "Аккаунт",
    mobileOnly: true,
    items: ACCOUNT_NAV_ITEMS,
  },
  {
    label: "Администрирование",
    items: [
      {
        to: "/admin/users",
        label: "Пользователи",
        icon: Users,
        permission: ADMIN_PERMISSIONS.USER_VIEW,
      },
      {
        to: "/admin/roles",
        label: "Роли",
        icon: ShieldCheck,
        permission: ADMIN_PERMISSIONS.ROLE_VIEW,
      },
      {
        to: "/admin/api-keys",
        label: "API-ключи",
        icon: KeyRound,
        permission: ADMIN_PERMISSIONS.APIKEY_VIEW,
      },
      {
        to: "/admin/audit",
        label: "Аудит",
        icon: ScrollText,
        permission: ADMIN_PERMISSIONS.AUDIT_VIEW,
      },
      {
        to: "/agents",
        label: "Агенты",
        icon: Cpu,
        permission: AGENT_PERMISSIONS.VIEW,
      },
    ],
  },
  {
    label: "Разработка",
    items: [
      {
        to: "/ui",
        label: "UI Kit",
        icon: LayoutGrid,
      },
    ],
  },
];
