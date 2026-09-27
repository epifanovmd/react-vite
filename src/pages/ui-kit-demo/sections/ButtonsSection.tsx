import {
  AsyncButton,
  AsyncIconButton,
  Button,
  type ButtonProps,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  IconButton,
} from "@shared/ui";
import {
  Download,
  Edit,
  Heart,
  Mail,
  Power,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { FC } from "react";

const VARIANTS: NonNullable<ButtonProps["variant"]>[] = [
  "primary",
  "secondary",
  "destructive",
  "success",
  "warning",
  "info",
  "outline",
  "ghost",
  "link",
];

const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export const ButtonsSection: FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Buttons</CardTitle>
      <CardDescription className="text-xs">Варианты и размеры</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center gap-1.5 flex-wrap">
        {VARIANTS.map(variant => (
          <Button key={variant} variant={variant} size="sm">
            {variant}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Button leftIcon={<Mail className="h-3.5 w-3.5" />} size="sm">
          Icon
        </Button>
        <Button loading size="sm">
          Loading
        </Button>
        <Button disabled size="sm">
          Disabled
        </Button>
        <AsyncButton size="sm" variant="outline" onClick={() => wait(1200)}>
          Async (1.2s)
        </AsyncButton>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Icon Buttons</p>
        <div className="flex items-center gap-2 flex-wrap">
          <IconButton variant="default" size="xs" aria-label="В избранное">
            <Heart size={14} />
          </IconButton>
          <IconButton variant="default" size="sm" aria-label="Редактировать">
            <Edit size={16} />
          </IconButton>
          <IconButton variant="destructive" size="sm" aria-label="Удалить">
            <Trash2 size={16} />
          </IconButton>
          <IconButton variant="primary" size="sm" aria-label="Скачать">
            <Download size={16} />
          </IconButton>
          <IconButton variant="success" size="sm" aria-label="Включить">
            <Power size={16} />
          </IconButton>
          <IconButton variant="warning" size="sm" aria-label="Выключить">
            <Power size={16} />
          </IconButton>
          <IconButton variant="solid" size="sm" aria-label="Скачать">
            <Download size={16} />
          </IconButton>
          <IconButton loading size="sm" aria-label="Загрузка">
            <RefreshCw size={16} />
          </IconButton>
          <AsyncIconButton
            variant="primary"
            size="sm"
            aria-label="Обновить"
            onClick={() => wait(1200)}
          >
            <RefreshCw size={16} />
          </AsyncIconButton>
        </div>
      </div>
    </CardContent>
  </Card>
);
