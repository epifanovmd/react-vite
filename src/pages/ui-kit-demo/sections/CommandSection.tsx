import { CommandDialogDemo, CommandInlineDemo } from "./command";
import { DemoBlock, DemoCard } from "./shared";

export const CommandSection = () => (
  <DemoCard
    title="Command"
    description="Командная панель на cmdk: фильтрация по вводу, стрелки и Enter, группы, шорткаты; окно по Ctrl/Cmd+K"
  >
    <DemoBlock title="Встроенная панель">
      <CommandInlineDemo />
    </DemoBlock>
    <DemoBlock title="CommandDialog + useCommandShortcut">
      <CommandDialogDemo />
    </DemoBlock>
  </DemoCard>
);
