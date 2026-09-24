import {
  Avatar,
  Skeleton,
  SkeletonAvatar,
  SkeletonGroup,
  SkeletonRow,
  SkeletonText,
  Switch,
} from "@shared/ui";
import { type FC, useState } from "react";

import { DemoBlock, DemoCard, DemoInline, DemoRow } from "./shared";

const AVATAR_SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

const USERS = [
  { name: "Анна Смирнова", text: "Отправила макеты на согласование" },
  { name: "Борис Орлов", text: "Созвон перенесён на четверг" },
  { name: "Вера Лебедева", text: "Готово, можно выкатывать" },
];

const PANEL_CLASS = "flex flex-col gap-4 rounded-lg border p-4";
const USER_ROW_CLASS = "flex items-center gap-3";
const USER_NAME_CLASS = "text-sm font-medium";
const USER_TEXT_CLASS = "text-xs text-muted-foreground";

export const SkeletonSection: FC = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <DemoCard
        title="Skeleton"
        description="Заглушки на время загрузки: скрыты от скринридера, SkeletonGroup объявляет загрузку один раз"
      >
        <DemoBlock title="Блок и радиусы">
          <DemoInline spacing="loose">
            <Skeleton radius="none" className="h-10 w-24" />
            <Skeleton radius="sm" className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton radius="full" className="h-10 w-24" />
          </DemoInline>
        </DemoBlock>

        <DemoBlock title="Текст">
          <DemoRow columns={3}>
            <SkeletonText lines={2} gap="sm" />
            <SkeletonText />
            <SkeletonText lines={5} gap="lg" />
          </DemoRow>
        </DemoBlock>

        <DemoBlock title="Аватар (шкала Avatar xs…xl)">
          <DemoInline spacing="loose">
            {AVATAR_SIZES.map(size => (
              <SkeletonAvatar key={size} size={size} />
            ))}
            <SkeletonAvatar size="lg" shape="square" />
          </DemoInline>
        </DemoBlock>

        <DemoBlock title="Строки списка и карточка">
          <DemoRow columns={2}>
            <SkeletonGroup label="Загрузка сообщений" className={PANEL_CLASS}>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow avatarSize="sm" />
              <SkeletonRow avatar={false} />
            </SkeletonGroup>

            <SkeletonGroup label="Загрузка карточки" className={PANEL_CLASS}>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-5 w-2/3" />
              <SkeletonText lines={3} />
              <Skeleton className="h-9 w-28" />
            </SkeletonGroup>
          </DemoRow>
        </DemoBlock>
      </DemoCard>

      <DemoCard
        title="Загрузка → контент"
        description="Скелетон повторяет форму будущего контента, чтобы разметка не прыгала"
      >
        <Switch
          label="Загружено"
          checked={loaded}
          onCheckedChange={setLoaded}
        />
        {loaded ? (
          <div className={PANEL_CLASS}>
            {USERS.map(user => (
              <div key={user.name} className={USER_ROW_CLASS}>
                <Avatar name={user.name} status="online" />
                <div className="flex min-w-0 flex-col gap-1">
                  <span className={USER_NAME_CLASS}>{user.name}</span>
                  <span className={USER_TEXT_CLASS}>{user.text}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <SkeletonGroup className={PANEL_CLASS}>
            {USERS.map(user => (
              <SkeletonRow key={user.name} />
            ))}
          </SkeletonGroup>
        )}
      </DemoCard>
    </div>
  );
};
