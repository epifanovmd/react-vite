import { formatHotkey, useHotkeys } from "@shared/lib/hotkeys";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@shared/ui";
import { Copy, Link2, Pencil, Share2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { DemoEmittedValue } from "../shared";

const HOTKEYS = {
  rename: "f2",
  copy: "mod+c",
  remove: ["backspace", "delete"],
} as const;

const AREA_CLASS =
  "flex h-36 select-none items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Контекстное меню по правому клику (или долгому нажатию) на области;
 * сочетания из подписей работают, пока фокус на области.
 */
export const ContextMenuDemo = () => {
  const areaRef = useRef<HTMLDivElement>(null);
  const [action, setAction] = useState("");

  const rename = () => setAction("Переименовать");
  const copy = () => setAction("Копировать");
  const remove = () => setAction("Удалить");

  useHotkeys(
    [
      [HOTKEYS.rename, rename],
      [HOTKEYS.copy, copy],
      [[...HOTKEYS.remove], remove],
    ],
    { target: areaRef },
  );

  return (
    <div className="flex flex-col gap-2">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div ref={areaRef} tabIndex={0} className={AREA_CLASS}>
            Кликните правой кнопкой мыши или поставьте фокус и нажмите сочетание
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem
            icon={<Pencil />}
            shortcut={formatHotkey(HOTKEYS.rename)}
            onSelect={rename}
          >
            Переименовать
          </ContextMenuItem>
          <ContextMenuItem
            icon={<Copy />}
            shortcut={formatHotkey(HOTKEYS.copy)}
            onSelect={copy}
          >
            Копировать
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger icon={<Share2 />}>
              Поделиться
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem icon={<Link2 />}>
                Скопировать ссылку
              </ContextMenuItem>
              <ContextMenuItem>По почте</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem
            variant="destructive"
            icon={<Trash2 />}
            shortcut={formatHotkey(HOTKEYS.remove[0])}
            onSelect={remove}
          >
            Удалить
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <DemoEmittedValue value={action} />
    </div>
  );
};
