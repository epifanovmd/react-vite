import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageEmpty,
  PageLoader,
} from "@shared/ui";

import { ErrorBoundaryDemo } from "./page-states";

export const PageStatesSection = () => (
  <div className="flex flex-col gap-4">
    <Card>
      <CardHeader>
        <CardTitle className="text-base">PageLoader и PageEmpty</CardTitle>
        <CardDescription className="text-xs">
          Растягиваются на свободное место страницы и центрируют содержимое
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="flex h-56 rounded-lg border">
          <PageLoader label="Загрузка профиля…" />
        </div>
        <div className="flex h-56 rounded-lg border">
          <PageEmpty
            size="sm"
            icon="search"
            title="Ничего не найдено"
            description="Измените фильтры или запрос"
            action={
              <Button size="sm" variant="outline">
                Сбросить фильтры
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-base">ErrorBoundary</CardTitle>
        <CardDescription className="text-xs">
          Стандартный фолбэк на Empty; ошибка сбрасывается кнопкой или сменой
          resetKeys (в приложении — путь роута)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ErrorBoundaryDemo />
      </CardContent>
    </Card>
  </div>
);
