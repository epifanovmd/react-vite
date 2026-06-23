import { type LinkProps } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LayoutGrid,
  type LucideIcon,
  Users,
} from "lucide-react";

export interface NavItem {
  to: LinkProps["to"];
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export const NAV_ICON_SIZE = 17;

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      {
        to: "/",
        label: "Дашборд",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Управление",
    items: [
      {
        to: "/users",
        label: "Пользователи",
        icon: Users,
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
