import {
  Avatar,
  AvatarGroup,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui";
import { FC } from "react";

const STATUSES = ["online", "away", "busy", "offline"] as const;
const STATUS_SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export const AvatarsSection: FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Avatar</CardTitle>
      <CardDescription className="text-xs">
        Изображение, fallback-инициалы, размеры, формы, статус и группа
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Размеры</p>
        <div className="flex items-center gap-3 flex-wrap">
          {(["xs", "sm", "md", "lg", "xl"] as const).map(s => (
            <Avatar key={s} size={s} name="Иван Петров" />
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">
          Изображение и формы
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Avatar src="https://i.pravatar.cc/100?img=12" name="Anna" />
          <Avatar
            src="https://i.pravatar.cc/100?img=5"
            name="Boris"
            shape="square"
          />
          <Avatar name="Сергей Сидоров" />
          <Avatar name="John Doe" shape="square" />
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">
          Статус (online / away / busy / offline)
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {STATUSES.map(status => (
            <Avatar key={status} name="Иван Петров" status={status} />
          ))}
          <Avatar
            src="https://i.pravatar.cc/100?img=32"
            name="Anna"
            status="online"
          />
          <Avatar name="John Doe" shape="square" status="busy" />
        </div>
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          {STATUS_SIZES.map(size => (
            <Avatar
              key={size}
              size={size}
              name="Мария Кузнецова"
              status="online"
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Группа (max=3)</p>
        <AvatarGroup max={3} size="md">
          <Avatar src="https://i.pravatar.cc/100?img=1" name="A" />
          <Avatar src="https://i.pravatar.cc/100?img=2" name="B" />
          <Avatar name="Виктор Власов" status="away" />
          <Avatar name="Daria Orlova" />
          <Avatar name="Egor Lebedev" />
        </AvatarGroup>
      </div>
    </CardContent>
  </Card>
);
