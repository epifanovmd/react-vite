import { formatHotkey, useHotkeys } from "@shared/lib/hotkeys";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { DemoEmittedValue } from "../shared";

const GRID_HOTKEY = "mod+g";

/** Чекбокс- и радио-пункты: меню не закрывается выбором состояния. */
export const DropdownCheckableDemo = () => {
  const [showGrid, setShowGrid] = useState(true);
  const [showRuler, setShowRuler] = useState(false);
  const [density, setDensity] = useState("comfortable");

  const keepOpen = (event: Event) => event.preventDefault();

  useHotkeys([[GRID_HOTKEY, () => setShowGrid(prev => !prev)]]);

  return (
    <div className="flex flex-col items-start gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<SlidersHorizontal size={14} />}
          >
            Вид
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Отображение</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={showGrid}
            onCheckedChange={setShowGrid}
            onSelect={keepOpen}
            shortcut={formatHotkey(GRID_HOTKEY)}
          >
            Сетка
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showRuler}
            onCheckedChange={setShowRuler}
            onSelect={keepOpen}
          >
            Линейка
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel inset>Плотность</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
            <DropdownMenuRadioItem value="compact">
              Компактная
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="comfortable">
              Обычная
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="spacious">
              Просторная
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DemoEmittedValue
        value={`grid=${showGrid}, ruler=${showRuler}, density=${density}`}
      />
    </div>
  );
};
