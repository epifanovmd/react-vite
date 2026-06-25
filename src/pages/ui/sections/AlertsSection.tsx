import {
  Alert,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui";
import { FC, useState } from "react";

export const AlertsSection: FC = () => {
  const [open, setOpen] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Alert</CardTitle>
        <CardDescription className="text-xs">
          Инлайн-сообщения: варианты, заголовок, закрытие
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Alert variant="info" title="Информация">
          Новая версия доступна — обновите страницу, чтобы применить изменения.
        </Alert>
        <Alert variant="success" title="Сохранено">
          Профиль успешно обновлён.
        </Alert>
        <Alert variant="warning" title="Внимание">
          Срок действия токена истекает через 3 дня.
        </Alert>
        <Alert variant="error" title="Ошибка">
          Не удалось загрузить данные. Попробуйте ещё раз.
        </Alert>
        <Alert variant="default">
          Нейтральное сообщение без иконки-статуса.
        </Alert>
        {open && (
          <Alert
            variant="info"
            title="Закрываемый алерт"
            onClose={() => setOpen(false)}
          >
            Нажмите на крестик, чтобы скрыть.
          </Alert>
        )}
        {!open && (
          <button
            type="button"
            className="text-xs text-primary underline-offset-4 hover:underline"
            onClick={() => setOpen(true)}
          >
            Показать закрываемый алерт снова
          </button>
        )}
      </CardContent>
    </Card>
  );
};
