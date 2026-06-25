import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@components/ui";
import { FC } from "react";

export const SeparatorsSection: FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Separator</CardTitle>
      <CardDescription className="text-xs">
        Горизонтальный, вертикальный и с подписью
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Горизонтальный</p>
        <div className="space-y-2">
          <p className="text-sm">Секция выше</p>
          <Separator />
          <p className="text-sm">Секция ниже</p>
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Вертикальный</p>
        <div className="flex h-6 items-center gap-3 text-sm">
          <span>Профиль</span>
          <Separator orientation="vertical" />
          <span>Настройки</span>
          <Separator orientation="vertical" />
          <span>Выход</span>
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">С подписью</p>
        <Separator label="или" />
      </div>
    </CardContent>
  </Card>
);
