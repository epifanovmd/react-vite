import { Chip, ScrollArea } from "@shared/ui";

import { DemoBlock, DemoCard, DemoField, DemoRow } from "./shared";

const MESSAGES = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  text: `Сообщение №${i + 1} — очень длинный текст, который обрезается многоточием`,
}));

const TAGS = [
  "React",
  "TypeScript",
  "MobX",
  "Inversify",
  "TanStack Router",
  "Tailwind CSS",
  "Socket.IO",
  "React Hook Form",
  "Zod",
  "Vitest",
  "Radix UI",
  "cmdk",
];

const BOX_CLASS = "rounded-lg border border-border";
const VERTICAL_BOX_CLASS = "h-64 rounded-lg border border-border";
const LIST_CLASS = "flex flex-col divide-y divide-border";
const ROW_CLASS = "truncate px-3 py-2 text-sm";
const CHIPS_CLASS = "flex w-max gap-2 p-3";

export const ScrollAreaSection = () => (
  <DemoCard
    title="ScrollArea"
    description="Кастомные полосы прокрутки поверх нативного скролла; viewportRef отдаёт прокручиваемый элемент"
  >
    <DemoBlock title="Вертикальный список">
      <DemoRow columns={2}>
        <DemoField label='type="hover" (по умолчанию)'>
          <ScrollArea className={VERTICAL_BOX_CLASS}>
            <ul className={LIST_CLASS}>
              {MESSAGES.map(message => (
                <li key={message.id} className={ROW_CLASS}>
                  {message.text}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </DemoField>
        <DemoField label='type="always"'>
          <ScrollArea type="always" className={VERTICAL_BOX_CLASS}>
            <ul className={LIST_CLASS}>
              {MESSAGES.map(message => (
                <li key={message.id} className={ROW_CLASS}>
                  {message.text}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </DemoField>
      </DemoRow>
    </DemoBlock>

    <DemoBlock title="Горизонтальный ряд чипов">
      <ScrollArea orientation="horizontal" className={BOX_CLASS}>
        <div className={CHIPS_CLASS}>
          {TAGS.map(tag => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
      </ScrollArea>
    </DemoBlock>
  </DemoCard>
);
