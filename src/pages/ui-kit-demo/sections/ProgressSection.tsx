import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
} from "@shared/ui";
import { FC, useEffect, useState } from "react";

export const ProgressSection: FC = () => {
  const [value, setValue] = useState(0.35);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(
      () =>
        setValue(current => {
          if (current >= 1) {
            setRunning(false);

            return 1;
          }

          return current + 0.02;
        }),
      120,
    );

    return () => clearInterval(timer);
  }, [running]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Progress</CardTitle>
        <CardDescription className="text-xs">
          Полоса прогресса: значение — доля от 0 до 1, а не проценты
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Размеры</p>
          <Progress value={0.6} size="sm" />
          <Progress value={0.6} size="md" />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Варианты</p>
          <Progress value={0.75} variant="primary" />
          <Progress value={0.75} variant="success" />
          <Progress value={0.75} variant="destructive" />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Неопределённый — когда доля неизвестна
          </p>
          <Progress indeterminate />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Живой: {Math.round(value * 100)}%
          </p>
          <Progress
            value={value}
            variant={value >= 1 ? "success" : "primary"}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRunning(current => !current)}
            >
              {running ? "Пауза" : "Запустить"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setRunning(false);
                setValue(0);
              }}
            >
              Сбросить
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
