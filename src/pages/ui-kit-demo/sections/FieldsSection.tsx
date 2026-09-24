import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  InfoField,
  Input,
  LabeledField,
  Segmented,
} from "@shared/ui";
import { useId, useState } from "react";

const PERIOD_OPTIONS = [
  { value: "day", label: "День" },
  { value: "week", label: "Неделя" },
  { value: "month", label: "Месяц" },
];

export const FieldsSection = () => {
  const nameId = useId();
  const [period, setPeriod] = useState("week");

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">InfoField</CardTitle>
          <CardDescription className="text-xs">
            Пара «подпись / значение»; 0 — значение, пустая строка — emptyText
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            <InfoField label="Имя" value="Иван Петров" className="bg-card" />
            <InfoField
              label="Email"
              value="ivan@example.com"
              className="bg-card"
              action={
                <Button size="sm" variant="outline">
                  Подтвердить
                </Button>
              }
            />
            <InfoField label="Остаток" value={0} className="bg-card" />
            <InfoField
              label="Телефон"
              value=""
              emptyText="не указан"
              className="bg-card"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">LabeledField</CardTitle>
          <CardDescription className="text-xs">
            Подпись над контролом вне формы: htmlFor для нативного контрола,
            aria-labelledby для составного
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <LabeledField label="Название" hint="до 80 символов" htmlFor={nameId}>
            <Input id={nameId} placeholder="Введите название" />
          </LabeledField>
          <LabeledField label="Период" hint="группировка">
            <Segmented
              options={PERIOD_OPTIONS}
              value={period}
              onValueChange={setPeriod}
            />
          </LabeledField>
        </CardContent>
      </Card>
    </div>
  );
};
