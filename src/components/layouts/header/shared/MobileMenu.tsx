import { Link } from "@tanstack/react-router";
import { LogOut, User, X } from "lucide-react";
import { FC } from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { IconButton, ThemeToggle } from "../../../ui";
import { AppLogoLink } from "../../app-logo-link";
import { NavGroup } from "../constants";
import { HeaderNavItem } from "./HeaderNavItem";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visibleGroups: NavGroup[];
  displayName: string;
  initials: string;
  subtitle?: string;
  onSignOut: () => void;
}

export const MobileMenu: FC<MobileMenuProps> = ({
  open,
  onOpenChange,
  visibleGroups,
  displayName,
  initials,
  subtitle,
  onSignOut,
}) => {
  const close = () => onOpenChange(false);

  return (
    <DrawerPrimitive.Root open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={close}
        />
        <DrawerPrimitive.Content className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-card shadow-xl outline-none">
          <DrawerPrimitive.Title className="sr-only">
            Навигация
          </DrawerPrimitive.Title>

          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <AppLogoLink size="sm" />
            <IconButton
              variant="ghost"
              size="sm"
              onClick={close}
              aria-label="Закрыть меню"
            >
              <X size={16} />
            </IconButton>
          </div>

          <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
            {visibleGroups.map((group, gi) => (
              <div key={group.label ?? gi} className="flex flex-col gap-1">
                {group.label && (
                  <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                    {group.label}
                  </p>
                )}
                {group.items.map(item => (
                  <HeaderNavItem
                    key={item.to as string}
                    item={item}
                    list
                    onClick={close}
                  />
                ))}
              </div>
            ))}
          </nav>

          <div className="flex flex-col gap-1 border-t border-border p-2">
            <Link
              to="/profile"
              onClick={close}
              className="flex items-center gap-2.5 rounded-lg p-2 transition-colors hover:bg-accent data-[status=active]:bg-accent"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand/70 text-xs font-semibold text-brand-foreground ring-1 ring-inset ring-white/15">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  {displayName}
                </p>
                {subtitle && (
                  <p className="truncate text-[11px] text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>
              <User size={15} className="flex-shrink-0 text-muted-foreground" />
            </Link>

            <div className="flex items-center justify-between rounded-lg px-2 py-1">
              <span className="text-xs text-muted-foreground">
                Тема оформления
              </span>
              <ThemeToggle variant="ghost" size="sm" className="h-7 w-7 p-0" />
            </div>

            <button
              type="button"
              onClick={() => {
                close();
                onSignOut();
              }}
              className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut size={16} />
              Выйти
            </button>
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
};
