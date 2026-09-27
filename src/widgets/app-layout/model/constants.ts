import { KnownPermission } from "@shared/api/gen/main/model";
import { type LinkProps } from "@tanstack/react-router";
import {
  Activity,
  FolderOpen,
  KeyRound,
  LayoutGrid,
  ListChecks,
  type LucideIcon,
  ScrollText,
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
  /** Пункт виден, только если у пользователя есть это право. */
  permission?: KnownPermission;
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
        permission: KnownPermission["user:view"],
      },
      {
        to: "/admin/roles",
        label: "Роли",
        icon: ShieldCheck,
        permission: KnownPermission["role:view"],
      },
      {
        to: "/admin/api-keys",
        label: "API-ключи",
        icon: KeyRound,
        permission: KnownPermission["apikey:manage"],
      },
      {
        to: "/admin/audit",
        label: "Аудит",
        icon: ScrollText,
        permission: KnownPermission["audit:view"],
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
