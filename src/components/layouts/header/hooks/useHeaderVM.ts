import { useAuthStore } from "@store";
import { useState } from "react";

import { NAV_GROUPS, NavItem } from "../constants";

export const useHeaderVM = () => {
  const { user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName =
    [user?.profile?.firstName, user?.profile?.lastName]
      .filter(Boolean)
      .join(" ") ||
    user?.email ||
    "Admin";

  const initials =
    [user?.profile?.firstName, user?.profile?.lastName]
      .filter(Boolean)
      .map(s => s![0])
      .join("")
      .toUpperCase() || (user?.email?.[0] ?? "A").toUpperCase();

  const subtitle =
    user?.email ??
    user?.phone ??
    (user?.username ? `@${user.username}` : undefined);

  const visibleGroups = NAV_GROUPS.filter(group => group.items.length > 0);
  const navItems: NavItem[] = visibleGroups.flatMap(group => group.items);

  return {
    displayName,
    initials,
    subtitle,
    navItems,
    visibleGroups,
    mobileOpen,
    setMobileOpen,
  };
};
