import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Collapse,
  type CollapseVariant,
} from "@shared/ui";
import { Settings, Star } from "lucide-react";
import { useState } from "react";

const VARIANTS: CollapseVariant[] = ["ghost", "default", "filled", "bordered"];

export const CollapseSection = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(value => !value);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Collapse</CardTitle>
          <CardDescription className="text-xs">
            Варианты триггера: ghost, default, filled, bordered
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {VARIANTS.map(variant => (
            <Collapse key={variant} variant={variant}>
              <Collapse.Trigger
                leadingIcon={<Settings aria-hidden size={16} />}
              >
                {variant}
              </Collapse.Trigger>
              <Collapse.Content innerClassName="px-3 pb-3 text-sm text-muted-foreground">
                Содержимое секции «{variant}».
              </Collapse.Content>
            </Collapse>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Размеры и состояния</CardTitle>
          <CardDescription className="text-xs">
            size, disabled, свой индикатор, keepMounted и управляемый режим
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Collapse variant="bordered" size="sm">
            <Collapse.Trigger>size=sm</Collapse.Trigger>
            <Collapse.Content innerClassName="px-3 pb-3 text-xs text-muted-foreground">
              Компактный вариант.
            </Collapse.Content>
          </Collapse>

          <Collapse variant="bordered" size="lg" defaultOpen>
            <Collapse.Trigger>size=lg, defaultOpen</Collapse.Trigger>
            <Collapse.Content innerClassName="px-3 pb-3 text-sm text-muted-foreground">
              Открыт при монтировании.
            </Collapse.Content>
          </Collapse>

          <Collapse variant="default" disabled>
            <Collapse.Trigger>disabled</Collapse.Trigger>
            <Collapse.Content>Недоступно.</Collapse.Content>
          </Collapse>

          <Collapse variant="filled">
            <Collapse.Trigger icon={<Star aria-hidden size={14} />}>
              Свой индикатор
            </Collapse.Trigger>
            <Collapse.Content innerClassName="px-3 pb-3 text-sm text-muted-foreground">
              Индикатор поворачивается на 180°, как и стандартный.
            </Collapse.Content>
          </Collapse>

          <Collapse variant="filled">
            <Collapse.Trigger>keepMounted</Collapse.Trigger>
            <Collapse.Content
              keepMounted
              innerClassName="px-3 pb-3 text-sm text-muted-foreground"
            >
              Содержимое остаётся в DOM в свёрнутом состоянии.
            </Collapse.Content>
          </Collapse>

          <div className="space-y-2">
            <Button size="sm" variant="outline" onClick={toggle}>
              {open ? "Свернуть снаружи" : "Развернуть снаружи"}
            </Button>
            <Collapse variant="bordered" open={open} onOpenChange={setOpen}>
              <Collapse.Trigger>Управляемый</Collapse.Trigger>
              <Collapse.Content innerClassName="px-3 pb-3 text-sm text-muted-foreground">
                open={String(open)}
              </Collapse.Content>
            </Collapse>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
