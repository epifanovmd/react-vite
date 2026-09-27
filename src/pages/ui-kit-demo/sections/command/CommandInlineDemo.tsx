import { formatHotkey, useHotkeys } from "@shared/lib/hotkeys";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@shared/ui";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";
import { useState } from "react";

import { DemoEmittedValue } from "../shared";

const HOTKEYS = {
  profile: "mod+p",
  billing: "mod+b",
  settings: "mod+s",
} as const;

/** Сочетания срабатывают и при фокусе в поле поиска панели. */
const IN_SEARCH = { allowInInputs: true };

const ROOT_CLASS = "max-w-md border border-border shadow-sm";

/** Встроенная панель: группы, иконки, шорткаты, отключённый пункт. */
export const CommandInlineDemo = () => {
  const [selected, setSelected] = useState("");

  useHotkeys([
    [HOTKEYS.profile, () => setSelected("Профиль"), IN_SEARCH],
    [HOTKEYS.billing, () => setSelected("Платежи"), IN_SEARCH],
    [HOTKEYS.settings, () => setSelected("Настройки"), IN_SEARCH],
  ]);

  return (
    <div className="flex flex-col gap-2">
      <Command className={ROOT_CLASS}>
        <CommandInput placeholder="Команда или поиск…" />
        <CommandList className="max-h-64">
          <CommandEmpty />
          <CommandGroup heading="Предложения">
            <CommandItem icon={<Calendar />} onSelect={setSelected}>
              Календарь
            </CommandItem>
            <CommandItem icon={<Smile />} onSelect={setSelected}>
              Эмодзи
            </CommandItem>
            <CommandItem icon={<Calculator />} disabled>
              Калькулятор
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Настройки">
            <CommandItem
              icon={<User />}
              shortcut={formatHotkey(HOTKEYS.profile)}
              onSelect={setSelected}
            >
              Профиль
            </CommandItem>
            <CommandItem
              icon={<CreditCard />}
              shortcut={formatHotkey(HOTKEYS.billing)}
              keywords={["billing", "оплата"]}
              onSelect={setSelected}
            >
              Платежи
            </CommandItem>
            <CommandItem
              icon={<Settings />}
              shortcut={formatHotkey(HOTKEYS.settings)}
              onSelect={setSelected}
            >
              Настройки
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <DemoEmittedValue value={selected} />
    </div>
  );
};
