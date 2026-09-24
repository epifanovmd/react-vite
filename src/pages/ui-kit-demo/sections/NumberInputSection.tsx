import { NumberInput } from "@shared/ui";
import { Percent } from "lucide-react";
import { type FC, useState } from "react";

import {
  DemoBlock,
  DemoCard,
  DemoEmittedValue,
  DemoField,
  DemoRow,
} from "./shared";

const CURRENCY_FORMAT: Intl.NumberFormatOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const toEmitted = (value: number | null): string =>
  value === null ? "" : String(value);

export const NumberInputSection: FC = () => {
  const [amount, setAmount] = useState<number | null>(1500);
  const [quantity, setQuantity] = useState<number | null>(5);

  return (
    <DemoCard
      title="NumberInput"
      description="Число или null: без фокуса форматируется по ru-RU, в фокусе правится как текст; ↑/↓ и кнопки меняют на step, Shift — ×10, при потере фокуса значение зажимается в [min, max]"
    >
      <DemoBlock title="Базовые">
        <DemoRow>
          <DemoField label="По умолчанию">
            <NumberInput aria-label="Число" placeholder="Введите число" />
          </DemoField>
          <DemoField label="Валюта: suffix ₽ + precision 2">
            <NumberInput
              aria-label="Сумма"
              value={amount}
              onValueChange={setAmount}
              precision={2}
              min={0}
              suffix="₽"
              formatOptions={CURRENCY_FORMAT}
              clearable
            />
            <DemoEmittedValue value={toEmitted(amount)} />
          </DemoField>
          <DemoField label="prefix «до» + leftIcon">
            <NumberInput
              aria-label="Скидка"
              defaultValue={15}
              min={0}
              max={100}
              leftIcon={<Percent className="h-4 w-4" />}
              prefix="до"
            />
          </DemoField>
        </DemoRow>
      </DemoBlock>

      <DemoBlock title="Границы и шаг">
        <DemoRow>
          <DemoField label="min 1, max 10">
            <NumberInput
              aria-label="Количество"
              value={quantity}
              onValueChange={setQuantity}
              min={1}
              max={10}
              allowNegative={false}
              precision={0}
            />
            <DemoEmittedValue value={toEmitted(quantity)} />
          </DemoField>
          <DemoField label="step 0.5, precision 1">
            <NumberInput
              aria-label="Рейтинг"
              defaultValue={3.5}
              min={0}
              max={5}
              step={0.5}
              precision={1}
            />
          </DemoField>
          <DemoField label="Без кнопок (hideControls)">
            <NumberInput
              aria-label="Вес"
              defaultValue={72.4}
              suffix="кг"
              hideControls
            />
          </DemoField>
        </DemoRow>
      </DemoBlock>

      <DemoBlock title="Размеры и состояния">
        <DemoRow>
          <DemoField label="sm">
            <NumberInput aria-label="Число sm" size="sm" defaultValue={10} />
          </DemoField>
          <DemoField label="lg + error">
            <NumberInput
              aria-label="Число lg"
              size="lg"
              variant="error"
              defaultValue={-5}
            />
          </DemoField>
          <DemoField label="disabled">
            <NumberInput
              aria-label="Число недоступно"
              defaultValue={42}
              suffix="шт."
              disabled
            />
          </DemoField>
        </DemoRow>
      </DemoBlock>
    </DemoCard>
  );
};
