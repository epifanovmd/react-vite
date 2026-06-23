import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  IconButton,
  Popover,
} from "@components/ui";
import { Bell, Info, Power, Settings, User, X } from "lucide-react";
import { FC } from "react";

export const PopoverSection: FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Popover</CardTitle>
      <CardDescription className="text-xs">
        Всплывающие панели — варианты, размеры, стрелка
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Variants */}
      <div>
        <p className="text-xs text-muted-foreground mb-3">Варианты</p>
        <div className="flex items-center gap-3 flex-wrap">
          <Popover>
            <Popover.Trigger asChild>
              <Button size="sm" variant="outline">
                Default
              </Button>
            </Popover.Trigger>
            <Popover.Content size="sm">
              <p className="font-medium mb-1">Default popover</p>
              <p className="text-muted-foreground">
                Стандартный стиль с белым фоном.
              </p>
            </Popover.Content>
          </Popover>

          <Popover>
            <Popover.Trigger asChild>
              <Button size="sm" variant="secondary">
                Dark
              </Button>
            </Popover.Trigger>
            <Popover.Content variant="dark" size="sm">
              <p className="font-medium mb-1">Dark popover</p>
              <p className="text-gray-300">Тёмный стиль для акцентов.</p>
            </Popover.Content>
          </Popover>

          <Popover>
            <Popover.Trigger asChild>
              <Button size="sm" variant="outline">
                <Info size={14} className="mr-1" /> Info
              </Button>
            </Popover.Trigger>
            <Popover.Content variant="info" size="sm">
              <p className="font-medium mb-1">Информация</p>
              <p>Используется для справочных подсказок.</p>
            </Popover.Content>
          </Popover>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="text-xs text-muted-foreground mb-3">Размеры</p>
        <div className="flex items-center gap-3 flex-wrap">
          <Popover>
            <Popover.Trigger asChild>
              <Button size="sm" variant="outline">
                sm
              </Button>
            </Popover.Trigger>
            <Popover.Content size="sm">
              <p className="font-medium">Small (w-48)</p>
              <p className="text-muted-foreground mt-1">
                Компактный вариант для коротких подсказок.
              </p>
            </Popover.Content>
          </Popover>

          <Popover>
            <Popover.Trigger asChild>
              <Button size="sm" variant="outline">
                md
              </Button>
            </Popover.Trigger>
            <Popover.Content size="md">
              <p className="font-medium">Medium (w-72)</p>
              <p className="text-muted-foreground mt-1">
                Стандартный размер, используется по умолчанию.
              </p>
            </Popover.Content>
          </Popover>

          <Popover>
            <Popover.Trigger asChild>
              <Button size="sm" variant="outline">
                lg
              </Button>
            </Popover.Trigger>
            <Popover.Content size="lg">
              <p className="font-medium">Large (w-96)</p>
              <p className="text-muted-foreground mt-1">
                Широкий вариант для форм или расширенного контента.
              </p>
            </Popover.Content>
          </Popover>

          <Popover>
            <Popover.Trigger asChild>
              <Button size="sm" variant="outline">
                auto
              </Button>
            </Popover.Trigger>
            <Popover.Content size="auto">
              <p className="font-medium whitespace-nowrap">
                Auto — подстраивается под контент
              </p>
            </Popover.Content>
          </Popover>
        </div>
      </div>

      {/* With arrow */}
      <div>
        <p className="text-xs text-muted-foreground mb-3">Со стрелкой</p>
        <div className="flex items-center gap-3 flex-wrap">
          {(["top", "bottom", "left", "right"] as const).map(side => (
            <Popover key={side}>
              <Popover.Trigger asChild>
                <Button size="sm" variant="outline" className="capitalize">
                  {side}
                </Button>
              </Popover.Trigger>
              <Popover.Content size="sm" side={side}>
                <p className="font-medium capitalize">{side}</p>
                <p className="text-muted-foreground mt-1">Панель со стрелкой.</p>
                <Popover.Arrow />
              </Popover.Content>
            </Popover>
          ))}
        </div>
      </div>

      {/* Rich content */}
      <div>
        <p className="text-xs text-muted-foreground mb-3">Сложный контент</p>
        <div className="flex items-center gap-3 flex-wrap">
          <Popover>
            <Popover.Trigger asChild>
              <Button size="sm" variant="outline">
                <Bell size={14} className="mr-1" /> Уведомления
              </Button>
            </Popover.Trigger>
            <Popover.Content size="md" align="start">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-sm">Уведомления</p>
                <Popover.Close asChild>
                  <IconButton size="sm" variant="ghost">
                    <X size={12} />
                  </IconButton>
                </Popover.Close>
              </div>
              <div className="space-y-2">
                {[
                  "Новый пользователь подключился",
                  "Туннель wg0 отключён",
                  "Обновление доступно",
                ].map((msg, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs p-2 rounded bg-muted"
                  >
                    <Bell
                      size={12}
                      className="mt-0.5 shrink-0 text-muted-foreground"
                    />
                    <span>{msg}</span>
                  </div>
                ))}
              </div>
            </Popover.Content>
          </Popover>

          <Popover>
            <Popover.Trigger asChild>
              <Button size="sm" variant="outline">
                <User size={14} className="mr-1" /> Профиль
              </Button>
            </Popover.Trigger>
            <Popover.Content size="sm" align="start">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm leading-tight">Admin</p>
                  <p className="text-xs text-muted-foreground">
                    admin@example.com
                  </p>
                </div>
              </div>
              <div className="border-t pt-2 space-y-1">
                <button className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-muted flex items-center gap-2">
                  <Settings size={12} /> Настройки
                </button>
                <button className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-muted text-destructive flex items-center gap-2">
                  <Power size={12} /> Выйти
                </button>
              </div>
            </Popover.Content>
          </Popover>
        </div>
      </div>
    </CardContent>
  </Card>
);
