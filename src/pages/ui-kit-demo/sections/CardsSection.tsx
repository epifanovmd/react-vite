import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  type CardProps,
  CardTitle,
} from "@shared/ui";
import type { FC } from "react";

type CardVariant = NonNullable<CardProps["variant"]>;

const VARIANTS: { variant: CardVariant; title: string; description: string }[] =
  [
    {
      variant: "default",
      title: "Обычная",
      description: "Рамка и лёгкая тень",
    },
    {
      variant: "elevated",
      title: "Приподнятая",
      description: "Тень усиливается при наведении",
    },
    {
      variant: "outline",
      title: "Контурная",
      description: "Толстая рамка без акцента",
    },
  ];

const CONTENT_CLASS = "text-sm text-muted-foreground";

export const CardsSection: FC = () => (
  <div className="flex flex-col gap-4">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {VARIANTS.map(item => (
        <Card key={item.variant} variant={item.variant}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent className={CONTENT_CLASS}>
            variant="{item.variant}"
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card
        title="Шорткат через пропсы"
        description="title, description, extra и footer без составных частей"
        extra={<Badge variant="success">Активна</Badge>}
        footer={
          <Button size="sm" variant="outline">
            Подробнее
          </Button>
        }
      >
        <p className={CONTENT_CLASS}>
          Содержимое карточки — всё, что передано в children.
        </p>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle as="h2">Составная карточка</CardTitle>
          <CardDescription>
            CardHeader, CardContent и CardFooter; заголовок — h2 через as
          </CardDescription>
        </CardHeader>
        <CardContent className={CONTENT_CLASS}>
          Секции сами управляют отступами, поэтому их можно комбинировать.
        </CardContent>
        <CardFooter className="justify-end">
          <Button size="sm" variant="ghost">
            Отмена
          </Button>
          <Button size="sm">Сохранить</Button>
        </CardFooter>
      </Card>
    </div>
  </div>
);
