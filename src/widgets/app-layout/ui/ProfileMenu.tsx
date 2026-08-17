import { SignOutButton } from "@features/sign-out";
import { Popover, ThemeToggle } from "@shared/ui";
import { Link } from "@tanstack/react-router";
import { ChevronDown, User } from "lucide-react";
import { FC } from "react";

import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileMenuProps {
  displayName: string;
  initials: string;
  subtitle?: string;
}

export const ProfileMenu: FC<ProfileMenuProps> = ({
  displayName,
  initials,
  subtitle,
}) => (
  <Popover>
    <Popover.Trigger asChild>
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-accent"
      >
        <ProfileAvatar initials={initials} />
        <span className="hidden max-w-[140px] truncate text-sm font-medium text-foreground sm:block">
          {displayName}
        </span>
        <ChevronDown
          size={15}
          className="hidden flex-shrink-0 text-muted-foreground sm:block"
        />
      </button>
    </Popover.Trigger>

    <Popover.Content size="sm" align="end" className="p-0">
      <div className="flex items-center gap-3 border-b border-border p-3">
        <ProfileAvatar initials={initials} size="md" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {displayName}
          </p>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col p-1">
        <Popover.Close asChild>
          <Link
            to="/profile"
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-accent"
          >
            <User size={16} className="text-muted-foreground" />
            Профиль
          </Link>
        </Popover.Close>

        <div className="flex items-center justify-between rounded-md px-2.5 py-1.5">
          <span className="text-sm text-muted-foreground">Тема</span>
          <ThemeToggle variant="ghost" size="sm" className="h-7 w-7 p-0" />
        </div>
      </div>

      <div className="border-t border-border p-1">
        <Popover.Close asChild>
          <SignOutButton className="w-full rounded-md px-2.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" />
        </Popover.Close>
      </div>
    </Popover.Content>
  </Popover>
);
