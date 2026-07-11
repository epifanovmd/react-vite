import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@components/ui";
import { useNotification } from "@lib/notifications";
import { FC, useRef } from "react";

const wait = (ms: number, fail = false) =>
  new Promise<string>((resolve, reject) => {
    setTimeout(
      () => (fail ? reject(new Error("Сетевая ошибка")) : resolve("Готово")),
      ms,
    );
  });

export const NotificationsSection: FC = () => {
  const toast = useNotification();
  const dedupId = useRef(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Notifications</CardTitle>
        <CardDescription className="text-xs">
          Тосты через NotificationService: варианты, заголовок, действие,
          loading, promise, дедуп и программное закрытие
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Базовые варианты */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Варианты</p>
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant="success"
              size="sm"
              onClick={() => toast.success("Профиль успешно сохранён")}
            >
              success
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => toast.error("Не удалось сохранить изменения")}
            >
              error
            </Button>
            <Button
              variant="warning"
              size="sm"
              onClick={() => toast.warning("Срок действия токена истекает")}
            >
              warning
            </Button>
            <Button
              variant="info"
              size="sm"
              onClick={() => toast.info("Доступна новая версия приложения")}
            >
              info
            </Button>
          </div>
        </div>

        <Separator />

        {/* Заголовок + действие */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            Заголовок и действие
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.info("Письмо с подтверждением отправлено на почту", {
                  title: "Проверьте почту",
                })
              }
            >
              с заголовком
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.success("Пользователь удалён", {
                  title: "Удалено",
                  action: {
                    label: "Отменить",
                    onClick: () => toast.info("Удаление отменено"),
                  },
                })
              }
            >
              с действием «Отменить»
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.error("Не удалось отправить отчёт", {
                  title: "Ошибка сети",
                  duration: Infinity,
                  action: [
                    {
                      label: "Повторить",
                      variant: "primary",
                      dismiss: false,
                      onClick: () => toast.info("Повторная попытка…"),
                    },
                    {
                      label: "Закрыть",
                      onClick: () => undefined,
                    },
                  ],
                })
              }
            >
              два действия + variant
            </Button>
          </div>
        </div>

        <Separator />

        {/* loading + promise */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            Loading и Promise
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const id = toast.loading("Загрузка данных…");

                setTimeout(() => toast.success("Данные загружены", { id }), 1800);
              }}
            >
              loading → success
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.promise(wait(1800), {
                  loading: "Сохраняем…",
                  success: "Успешно сохранено",
                  error: "Ошибка сохранения",
                })
              }
            >
              promise (resolve)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast
                  .promise(wait(1800, true), {
                    loading: "Удаляем…",
                    success: "Удалено",
                    error: err =>
                      err instanceof Error ? err.message : "Не удалось удалить",
                  })
                  .catch(() => undefined)
              }
            >
              promise (reject)
            </Button>
          </div>
        </div>

        <Separator />

        {/* Дедуп + закрытие */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            Дедуп и закрытие
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                dedupId.current += 1;
                toast.info(`Обновление одного тоста: #${dedupId.current}`, {
                  id: "dedup-demo",
                });
              }}
            >
              update по id (не плодит)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.info("Первый");
                toast.warning("Второй");
                toast.error("Третий");
              }}
            >
              показать несколько
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.dismiss()}
            >
              закрыть все
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
