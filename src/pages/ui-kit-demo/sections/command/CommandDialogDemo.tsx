import { formatHotkey, useHotkeys } from "@shared/lib/hotkeys";
import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Kbd,
  useCommandShortcut,
} from "@shared/ui";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  Settings,
} from "lucide-react";
import { useState } from "react";

import { DemoEmittedValue } from "../shared";

const OPEN_HOTKEY = "mod+k";
const SETTINGS_HOTKEY = "mod+,";

/** Командная панель в окне: кнопка и глобальное Ctrl/Cmd+K. */
export const CommandDialogDemo = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");

  useCommandShortcut(() => setOpen(prev => !prev));

  const run = (value: string) => {
    setSelected(value);
    setOpen(false);
  };

  useHotkeys(
    [[SETTINGS_HOTKEY, () => run("Настройки"), { allowInInputs: true }]],
    { enabled: open },
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Search size={14} />}
          onClick={() => setOpen(true)}
        >
          Открыть панель
        </Button>
        <span className="text-xs text-muted-foreground">
          или нажмите <Kbd>{formatHotkey(OPEN_HOTKEY)}</Kbd>
        </span>
      </div>
      <DemoEmittedValue value={selected} />

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Куда перейти?" />
        <CommandList>
          <CommandEmpty />
          <CommandGroup heading="Навигация">
            <CommandItem icon={<LayoutDashboard />} onSelect={run}>
              Дашборд
            </CommandItem>
            <CommandItem icon={<MessageSquare />} onSelect={run}>
              Сообщения
            </CommandItem>
            <CommandItem icon={<FileText />} onSelect={run}>
              Документы
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Аккаунт">
            <CommandItem
              icon={<Settings />}
              shortcut={formatHotkey(SETTINGS_HOTKEY)}
              onSelect={run}
            >
              Настройки
            </CommandItem>
            <CommandItem icon={<LogOut />} onSelect={run}>
              Выйти
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};
