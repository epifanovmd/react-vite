import { useUserStore } from "@store";
import { useState } from "react";

import { NAV_GROUPS, NavItem } from "../constants";

export const useHeaderVM = () => {
  const { user, model } = useUserStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = model?.displayName ?? "Admin";
  const initials = model?.initials ?? "A";

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
