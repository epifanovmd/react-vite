import { type LinkProps } from "@tanstack/react-router";
import { LayoutGrid, type LucideIcon, User } from "lucide-react";

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
        to: "/profile",
        label: "Профиль",
        icon: User,
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
