import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Empty,
} from "@shared/ui";
import { Sparkles } from "lucide-react";

export const EmptySection = () => (
  <div className="flex flex-col gap-4">
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Empty</CardTitle>
        <CardDescription className="text-xs">
          Пустое состояние с иконкой, описанием и действием
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Empty
          size="sm"
          icon="inbox"
          title="Сообщений нет"
          description="Начните диалог, и сообщения появятся здесь"
          action={<Button size="sm">Новое сообщение</Button>}
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-base">Варианты</CardTitle>
        <CardDescription className="text-xs">
          Именованные иконки и произвольный элемент
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border">
            <Empty
              size="sm"
              icon="search"
              title="Ничего не найдено"
              description="Попробуйте изменить запрос"
            />
          </div>
          <div className="rounded-lg border">
            <Empty
              size="sm"
              icon="package"
              title="Заказов нет"
              description="История заказов пуста"
              action={
                <Button size="sm" variant="primary">
                  В каталог
                </Button>
              }
            />
          </div>
          <div className="rounded-lg border">
            <Empty
              size="sm"
              icon="error"
              title="Не удалось загрузить"
              description="Проверьте соединение"
            />
          </div>
          <div className="rounded-lg border">
            <Empty
              size="sm"
              icon={<Sparkles aria-hidden className="h-8 w-8 text-brand" />}
              title="Свой значок"
              description={
                <>
                  Любой <code className="rounded bg-muted px-1">ReactNode</code>
                </>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
