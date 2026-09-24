import { formatHotkey, useHotkeys } from "@shared/lib/hotkeys";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
} from "@shared/ui";
import {
  Archive,
  Copy,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";

import { DemoEmittedValue } from "../shared";

const HOTKEYS = {
  rename: "f2",
  duplicate: "mod+d",
  archive: "mod+e",
  remove: ["backspace", "delete"],
} as const;

const ROW_CLASS =
  "flex max-w-md items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Действия со строкой: сочетания работают, пока фокус на строке
 * (`useHotkeys` с `target`), — как в таблицах и файловых менеджерах.
 */
export const DropdownRowActionsDemo = () => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [action, setAction] = useState("");

  const rename = () => setAction("Изменить");
  const duplicate = () => setAction("Дублировать");
  const archive = () => setAction("В архив");
  const remove = () => setAction("Удалить");

  useHotkeys(
    [
      [HOTKEYS.rename, rename],
      [HOTKEYS.duplicate, duplicate],
      [HOTKEYS.archive, archive],
      [[...HOTKEYS.remove], remove],
    ],
    { target: rowRef },
  );

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={rowRef}
        tabIndex={0}
        aria-label="Отчёт за квартал, строка с действиями"
        className={ROW_CLASS}
      >
        <FileText size={16} aria-hidden className="text-muted-foreground" />
        <span className="flex-1">Отчёт за квартал.pdf</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton variant="ghost" aria-label="Действия">
              <MoreHorizontal size={16} aria-hidden />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem
              icon={<Pencil />}
              shortcut={formatHotkey(HOTKEYS.rename)}
              onSelect={rename}
            >
              Изменить
            </DropdownMenuItem>
            <DropdownMenuItem
              icon={<Copy />}
              shortcut={formatHotkey(HOTKEYS.duplicate)}
              onSelect={duplicate}
            >
              Дублировать
            </DropdownMenuItem>
            <DropdownMenuItem
              icon={<Archive />}
              shortcut={formatHotkey(HOTKEYS.archive)}
              onSelect={archive}
            >
              В архив
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              icon={<Trash2 />}
              shortcut={formatHotkey(HOTKEYS.remove[0])}
              onSelect={remove}
            >
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-xs text-muted-foreground">
        Поставьте фокус на строку (клик или Tab) и нажмите сочетание.
      </p>
      <DemoEmittedValue value={action} />
    </div>
  );
};
