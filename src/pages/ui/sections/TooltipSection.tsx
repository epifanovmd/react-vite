import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  IconButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui";
import { Download, Power, Trash2 } from "lucide-react";
import { FC } from "react";

export const TooltipSection: FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Tooltip</CardTitle>
      <CardDescription className="text-xs">
        Всплывающие подсказки
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-3">
          Через пропс content
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Tooltip content="Default tooltip">
            <Button size="sm">Default</Button>
          </Tooltip>
          <Tooltip content="Dark tooltip" contentProps={{ variant: "dark" }}>
            <Button size="sm" variant="secondary">
              Dark
            </Button>
          </Tooltip>
          <Tooltip content="Top placement" contentProps={{ side: "top" }}>
            <Button size="sm" variant="outline">
              Top
            </Button>
          </Tooltip>
          <Tooltip content="Right placement" contentProps={{ side: "right" }}>
            <Button size="sm" variant="outline">
              Right
            </Button>
          </Tooltip>
          <Tooltip content="Bottom placement" contentProps={{ side: "bottom" }}>
            <Button size="sm" variant="outline">
              Bottom
            </Button>
          </Tooltip>
          <Tooltip content="Left placement" contentProps={{ side: "left" }}>
            <Button size="sm" variant="outline">
              Left
            </Button>
          </Tooltip>
          <Tooltip content="Delayed tooltip (500ms)" delayDuration={500}>
            <Button size="sm" variant="ghost">
              Delayed
            </Button>
          </Tooltip>
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-3">
          Через sub-компоненты (скелет)
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton size="sm" variant="destructive">
                <Trash2 size={14} />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>Удалить</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton size="sm" variant="primary">
                <Download size={14} />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>Скачать файл</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton size="sm" variant="enable">
                <Power size={14} />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent variant="dark">Включить</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xs underline underline-offset-2 cursor-help text-muted-foreground">
                Что это?
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-48 text-center">
              Подробное описание функции в несколько строк
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </CardContent>
  </Card>
);
