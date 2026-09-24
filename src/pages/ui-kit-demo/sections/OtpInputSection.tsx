import { OtpInput } from "@shared/ui";
import { type FC, useState } from "react";

import {
  DemoBlock,
  DemoCard,
  DemoEmittedValue,
  DemoField,
  DemoRow,
} from "./shared";

const STATUS_CLASS = "text-xs text-muted-foreground";
const SUCCESS_CLASS = "text-xs text-success";

export const OtpInputSection: FC = () => {
  const [code, setCode] = useState("");
  const [completed, setCompleted] = useState<string | null>(null);

  const statusText = completed
    ? `Код ${completed} введён полностью`
    : "Вставьте «123-456» из буфера";
  const statusClass = completed ? SUCCESS_CLASS : STATUS_CLASS;

  const handleCodeChange = (next: string) => {
    setCode(next);
    if (next.length < 6) setCompleted(null);
  };

  return (
    <DemoCard
      title="OtpInput"
      description="Код подтверждения по ячейкам: ввод с переходом, Backspace и стрелки, вставка и автозаполнение из SMS целиком"
    >
      <DemoBlock title="Базовый (6 цифр)">
        <DemoRow columns={2}>
          <DemoField label="onValueChange + onComplete">
            <OtpInput
              aria-label="Код из SMS"
              value={code}
              onValueChange={handleCodeChange}
              onComplete={setCompleted}
            />
            <DemoEmittedValue value={code} />
            <p className={statusClass}>{statusText}</p>
          </DemoField>
          <DemoField label="4 цифры с разделителем">
            <OtpInput aria-label="PIN" length={4} separator={2} />
          </DemoField>
        </DemoRow>
      </DemoBlock>

      <DemoBlock title="Режимы">
        <DemoRow columns={2}>
          <DemoField label="mask — символы скрыты">
            <OtpInput aria-label="Секретный код" length={4} mask />
          </DemoField>
          <DemoField label="alphanumeric + separator [3]">
            <OtpInput
              aria-label="Код приглашения"
              mode="alphanumeric"
              separator={3}
            />
          </DemoField>
        </DemoRow>
      </DemoBlock>

      <DemoBlock title="Размеры">
        <DemoRow>
          <DemoField label="sm">
            <OtpInput aria-label="Код sm" length={4} size="sm" />
          </DemoField>
          <DemoField label="md (default)">
            <OtpInput aria-label="Код md" length={4} />
          </DemoField>
          <DemoField label="lg">
            <OtpInput aria-label="Код lg" length={4} size="lg" />
          </DemoField>
        </DemoRow>
      </DemoBlock>

      <DemoBlock title="Состояния">
        <DemoRow>
          <DemoField label="error">
            <OtpInput
              aria-label="Код с ошибкой"
              length={4}
              defaultValue="1234"
              variant="error"
            />
          </DemoField>
          <DemoField label="filled">
            <OtpInput aria-label="Код filled" length={4} variant="filled" />
          </DemoField>
          <DemoField label="disabled">
            <OtpInput
              aria-label="Код недоступен"
              length={4}
              defaultValue="12"
              disabled
            />
          </DemoField>
        </DemoRow>
      </DemoBlock>
    </DemoCard>
  );
};
