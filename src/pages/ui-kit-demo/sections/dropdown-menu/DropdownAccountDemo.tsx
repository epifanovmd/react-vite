import { formatHotkey, useHotkeys } from "@shared/lib/hotkeys";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@shared/ui";
import {
  CreditCard,
  Mail,
  MessageSquare,
  Settings,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

import { DemoEmittedValue } from "../shared";

const HOTKEYS = {
  profile: "mod+shift+p",
  billing: "mod+b",
  settings: "mod+,",
} as const;

/** Меню аккаунта: сочетания из подписей работают на всей странице. */
export const DropdownAccountDemo = () => {
  const [action, setAction] = useState("");

  const openProfile = () => setAction("Профиль");
  const openBilling = () => setAction("Оплата");
  const openSettings = () => setAction("Настройки");

  useHotkeys([
    [HOTKEYS.profile, openProfile],
    [HOTKEYS.billing, openBilling],
    [HOTKEYS.settings, openSettings],
  ]);

  return (
    <div className="flex flex-col items-start gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" leftIcon={<User size={14} />}>
            Аккаунт
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60">
          <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              icon={<User />}
              shortcut={formatHotkey(HOTKEYS.profile)}
              onSelect={openProfile}
            >
              Профиль
            </DropdownMenuItem>
            <DropdownMenuItem
              icon={<CreditCard />}
              shortcut={formatHotkey(HOTKEYS.billing)}
              onSelect={openBilling}
            >
              Оплата
            </DropdownMenuItem>
            <DropdownMenuItem
              icon={<Settings />}
              shortcut={formatHotkey(HOTKEYS.settings)}
              onSelect={openSettings}
            >
              Настройки
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger icon={<UserPlus />}>
              Пригласить
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48">
              <DropdownMenuItem icon={<Mail />}>По почте</DropdownMenuItem>
              <DropdownMenuItem icon={<MessageSquare />}>
                В мессенджере
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      <DemoEmittedValue value={action} />
    </div>
  );
};
