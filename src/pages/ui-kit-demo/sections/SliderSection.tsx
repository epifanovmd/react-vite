import { Slider } from "@shared/ui";
import { type FC, useState } from "react";

import {
  DemoBlock,
  DemoCard,
  DemoEmittedValue,
  DemoField,
  DemoRow,
} from "./shared";

const PRICE_MARKS = [
  { value: 0, label: "0 ₽" },
  { value: 25_000, label: "25 тыс." },
  { value: 50_000, label: "50 тыс." },
  { value: 75_000, label: "75 тыс." },
  { value: 100_000, label: "100 тыс." },
];

const STEP_MARKS = [0, 25, 50, 75, 100].map(value => ({ value }));

const VERTICAL_CLASS = "flex h-48 items-stretch gap-10";

const formatPercent = (value: number): string => `${value}%`;

const formatRubles = (value: number): string =>
  `${value.toLocaleString("ru-RU")} ₽`;

export const SliderSection: FC = () => {
  const [volume, setVolume] = useState(40);
  const [price, setPrice] = useState([20_000, 60_000]);

  return (
    <DemoCard
      title="Slider"
      description="Одиночное значение или диапазон на Radix Slider: клавиатура (стрелки, PageUp/PageDown, Home/End), метки шкалы, подпись значения"
    >
      <DemoBlock title="Значение и диапазон">
        <DemoRow columns={2}>
          <DemoField label="Одиночный (controlled)">
            <Slider
              aria-label="Громкость"
              value={volume}
              onValueChange={setVolume}
            />
            <DemoEmittedValue value={String(volume)} />
          </DemoField>
          <DemoField label="Диапазон: «Минимум» / «Максимум»">
            <Slider
              value={price}
              onValueChange={setPrice}
              max={100_000}
              step={1_000}
              formatValue={formatRubles}
            />
            <DemoEmittedValue value={price.map(formatRubles).join(" — ")} />
          </DemoField>
        </DemoRow>
      </DemoBlock>

      <DemoBlock title="Подпись значения и метки">
        <DemoRow columns={2}>
          <DemoField label="showValue + formatValue">
            <Slider
              aria-label="Яркость"
              defaultValue={65}
              showValue
              formatValue={formatPercent}
            />
          </DemoField>
          <DemoField label="marks с подписями">
            <Slider
              defaultValue={[25_000, 75_000]}
              max={100_000}
              step={5_000}
              marks={PRICE_MARKS}
              formatValue={formatRubles}
            />
          </DemoField>
        </DemoRow>
      </DemoBlock>

      <DemoBlock title="Размеры, интенты, состояния">
        <DemoRow columns={2}>
          <DemoField label="sm + success, метки без подписей">
            <Slider
              aria-label="Прогресс"
              size="sm"
              variant="success"
              defaultValue={50}
              step={25}
              marks={STEP_MARKS}
            />
          </DemoField>
          <DemoField label="destructive">
            <Slider aria-label="Риск" variant="destructive" defaultValue={80} />
          </DemoField>
          <DemoField label="warning">
            <Slider aria-label="Нагрузка" variant="warning" defaultValue={60} />
          </DemoField>
          <DemoField label="disabled">
            <Slider aria-label="Недоступно" defaultValue={[30, 70]} disabled />
          </DemoField>
        </DemoRow>
      </DemoBlock>

      <DemoBlock title="Вертикальный">
        <div className={VERTICAL_CLASS}>
          <Slider
            aria-label="Эквалайзер 60 Гц"
            orientation="vertical"
            defaultValue={70}
          />
          <Slider
            aria-label="Эквалайзер 1 кГц"
            orientation="vertical"
            defaultValue={40}
            showValue
            formatValue={formatPercent}
          />
          <Slider
            orientation="vertical"
            defaultValue={[20, 80]}
            marks={STEP_MARKS.map(mark => ({ ...mark, label: mark.value }))}
          />
        </div>
      </DemoBlock>
    </DemoCard>
  );
};
