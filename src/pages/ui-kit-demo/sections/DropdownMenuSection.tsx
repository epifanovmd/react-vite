import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui";
import { ChevronDown } from "lucide-react";

import {
  ContextMenuDemo,
  DropdownAccountDemo,
  DropdownCheckableDemo,
  DropdownRowActionsDemo,
} from "./dropdown-menu";
import { DemoBlock, DemoCard, DemoInline } from "./shared";

export const DropdownMenuSection = () => (
  <div className="flex flex-col gap-6">
    <DemoCard
      title="DropdownMenu"
      description="Меню действий на Radix: клавиатура (стрелки, Home/End, поиск по первой букве), иконки, вложенные меню; подписи сочетаний — formatHotkey, обработка — useHotkeys"
    >
      <DemoBlock title="Базовое">
        <DemoInline>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                rightIcon={<ChevronDown size={14} />}
              >
                Открыть
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem>Новый файл</DropdownMenuItem>
              <DropdownMenuItem>Новая папка</DropdownMenuItem>
              <DropdownMenuItem disabled>Импорт (недоступно)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DemoInline>
      </DemoBlock>

      <DemoBlock title="Иконки и глобальные сочетания">
        <DropdownAccountDemo />
      </DemoBlock>

      <DemoBlock title="Чекбоксы и радио">
        <DropdownCheckableDemo />
      </DemoBlock>

      <DemoBlock title="Действия со строкой: сочетания при фокусе на строке">
        <DropdownRowActionsDemo />
      </DemoBlock>
    </DemoCard>

    <DemoCard
      title="ContextMenu"
      description="Те же части, что у DropdownMenu, но открывается по правому клику на области"
    >
      <ContextMenuDemo />
    </DemoCard>
  </div>
);
