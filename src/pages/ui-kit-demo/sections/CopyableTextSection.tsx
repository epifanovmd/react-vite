import { INotificationService } from "@shared/lib/notifications";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CopyableText,
} from "@shared/ui";

const TOKEN = "sk-live-9f3a2c1d7b4e6a8c0d2f4b6e8a1c3e5f";

export const CopyableTextSection = () => {
  const toast = INotificationService.useInstance();

  const notifyRowClick = () => toast.info("Клик по строке");
  const notifyCopied = () => toast.success("Скопировано в буфер обмена");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">CopyableText</CardTitle>
        <CardDescription className="text-xs">
          Копирование в буфер через useClipboard; тултип показывает текст, а
          после клика — «Скопировано»
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Базовый</p>
          <CopyableText text="a1b2c3d4-e5f6-7890" />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            displayText и onCopied
          </p>
          <CopyableText
            text={TOKEN}
            displayText="sk-live-••••3e5f"
            onCopied={notifyCopied}
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            Обрезка в узком контейнере
          </p>
          <div className="w-48 rounded-md border p-2">
            <CopyableText text={TOKEN} />
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            Внутри кликабельной строки: клик по кнопке не всплывает
          </p>
          {/* Строка кликабельна мышью, как строка таблицы: интерактивный
              CopyableText нельзя вкладывать в <button>. */}
          <div
            onClick={notifyRowClick}
            className="flex w-full cursor-pointer items-center justify-between rounded-md border p-3 text-sm transition-colors hover:bg-accent"
          >
            <span>Заказ #4821</span>
            <CopyableText text="4821" displayText="ID 4821" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
