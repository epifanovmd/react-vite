import { Menu } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { IconButton } from "../../ui";
import { AppLogoLink } from "../app-logo-link";
import { useHeaderVM } from "./hooks";
import { HeaderNavItem, MobileMenu, ProfileMenu } from "./shared";

interface HeaderProps {
  onSignOut: () => void;
}

export const Header: FC<HeaderProps> = observer(({ onSignOut }) => {
  const {
    displayName,
    initials,
    subtitle,
    navItems,
    visibleGroups,
    mobileOpen,
    setMobileOpen,
  } = useHeaderVM();

  return (
    <header className="sticky top-0 z-30 flex-shrink-0 border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 px-3 sm:gap-4 sm:px-4">
        <IconButton
          variant="ghost"
          size="md"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Открыть меню"
        >
          <Menu size={18} />
        </IconButton>

        <AppLogoLink />

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {navItems.map(item => (
            <HeaderNavItem key={item.to as string} item={item} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <ProfileMenu
            displayName={displayName}
            initials={initials}
            subtitle={subtitle}
            onSignOut={onSignOut}
          />
        </div>
      </div>

      <MobileMenu
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        visibleGroups={visibleGroups}
        displayName={displayName}
        initials={initials}
        subtitle={subtitle}
        onSignOut={onSignOut}
      />
    </header>
  );
});
