import {
  Autocomplete,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  IconButton,
  Input,
  phoneMask,
  Textarea,
  useAsyncOptions,
  useStaticOptions,
} from "@shared/ui";
import { Calendar, Search, SlidersHorizontal } from "lucide-react";
import { type FC, useState } from "react";

import { DemoBlock, DemoEmittedValue, DemoField, DemoRow } from "./shared";

const noop = () => {};

const phoneOptions = [
  { value: "79161234567", label: "+7 (916) 123-45-67 — Иван" },
  { value: "79261234567", label: "+7 (926) 123-45-67 — Мария" },
  { value: "79031234567", label: "+7 (903) 123-45-67 — Алексей" },
  { value: "74951234567", label: "+7 (495) 123-45-67 — Офис" },
  { value: "78121234567", label: "+7 (812) 123-45-67 — СПб" },
];

// Для автокомплита value — это текст, который подставится в инпут при выборе
const countryOptions = [
  { value: "Россия", label: "Россия" },
  { value: "США", label: "США" },
  { value: "Германия", label: "Германия" },
  { value: "Франция", label: "Франция" },
  { value: "Китай", label: "Китай" },
  { value: "Япония", label: "Япония" },
];

export const InputsSection: FC = () => {
  const [autoPhone, setAutoPhone] = useState("");
  const [autoCountry, setAutoCountry] = useState("");
  const [asyncCountry, setAsyncCountry] = useState("");

  // Стратегия: статические опции с клиентским поиском
  const staticCountryProps = useStaticOptions(countryOptions, { search: true });

  // Стратегия: статические опции с клиентским поиском (для masked)
  const staticPhoneProps = useStaticOptions(phoneOptions, { search: true });

  // Стратегия: асинхронная загрузка (имитация)
  const asyncCountryProps = useAsyncOptions({
    fetch: async (query: string) => {
      // Имитация серверного поиска
      await new Promise(r => setTimeout(r, 300));

      return countryOptions.filter(
        o =>
          String(o.label).toLowerCase().includes(query.toLowerCase()) ||
          String(o.value).toLowerCase().includes(query.toLowerCase()),
      );
    },
    getOption: o => o,
    debounce: 200,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Inputs</CardTitle>
        <CardDescription className="text-xs">
          Текстовые поля и автокомплит
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* ── Базовые ──────────────────────────────────────────────────── */}
        <DemoBlock title="Базовые">
          <DemoRow>
            <DemoField label="По умолчанию">
              <Input placeholder="Обычное поле" />
            </DemoField>
            <DemoField label="С иконкой">
              <Input
                placeholder="С иконкой слева"
                leftIcon={<Search className="h-4 w-4" />}
              />
            </DemoField>
            <DemoField label="clearable">
              <Input placeholder="Поле с очисткой" clearable onClear={noop} />
            </DemoField>
          </DemoRow>
        </DemoBlock>

        {/* ── Варианты ────────────────────────────────────────────────── */}
        <DemoBlock title="Варианты">
          <DemoRow>
            <DemoField label="filled">
              <Input placeholder="Заливка" variant="filled" />
            </DemoField>
            <DemoField label="filled-error">
              <Input placeholder="Заливка с ошибкой" variant="filled-error" />
            </DemoField>
            <DemoField label="filled-success">
              <Input placeholder="Заливка, успешно" variant="filled-success" />
            </DemoField>
          </DemoRow>
        </DemoBlock>

        {/* ── Состояния ───────────────────────────────────────────────── */}
        <DemoBlock title="Состояния">
          <DemoRow>
            <DemoField label="error">
              <Input placeholder="Ошибка" variant="error" />
            </DemoField>
            <DemoField label="success">
              <Input placeholder="Успешно" variant="success" />
            </DemoField>
            <DemoField label="disabled">
              <Input placeholder="Недоступно" disabled />
            </DemoField>
          </DemoRow>
        </DemoBlock>

        {/* ── Особые ──────────────────────────────────────────────────── */}
        <DemoBlock title="Особые">
          <DemoRow>
            <DemoField label="password">
              <Input type="password" placeholder="Пароль" />
            </DemoField>
            <DemoField label="loading">
              <Input placeholder="Загрузка..." loading />
            </DemoField>
          </DemoRow>
        </DemoBlock>

        <DemoBlock title="Интерактивные слоты">
          <DemoRow>
            <DemoField label="leftAddon">
              <Input
                placeholder="Открыть календарь"
                leftAddon={
                  <IconButton
                    aria-label="Открыть календарь"
                    size="xs"
                    variant="ghost"
                    onClick={noop}
                  >
                    <Calendar className="h-4 w-4" />
                  </IconButton>
                }
              />
            </DemoField>
            <DemoField label="rightAddon + clearable">
              <Input
                placeholder="Фильтр"
                clearable
                defaultValue="запрос"
                rightAddon={
                  <IconButton
                    aria-label="Настроить фильтр"
                    size="xs"
                    variant="ghost"
                    onClick={noop}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </IconButton>
                }
              />
            </DemoField>
          </DemoRow>
        </DemoBlock>

        <DemoBlock title="Textarea">
          <DemoRow>
            <DemoField label="Autosize + счётчик">
              <Textarea
                placeholder="Расскажите о себе"
                maxLength={120}
                showCount
              />
            </DemoField>
            <DemoField label="Фиксированная высота">
              <Textarea autoResize={false} minRows={4} placeholder="resize-y" />
            </DemoField>
            <DemoField label="Floating label">
              <Field
                htmlFor="floating-bio"
                label="Комментарий"
                labelPlacement="floating"
              >
                <Textarea id="floating-bio" />
              </Field>
            </DemoField>
          </DemoRow>
        </DemoBlock>

        <DemoBlock title="Floating label">
          <DemoRow>
            <Field
              htmlFor="floating-email"
              label="Email"
              labelPlacement="floating"
            >
              <Input id="floating-email" type="email" />
            </Field>
            <Field
              description="Label остаётся сверху после заполнения"
              htmlFor="floating-name"
              label="Имя"
              labelPlacement="floating"
              required
            >
              <Input id="floating-name" defaultValue="Андрей" />
            </Field>
            <Field
              error="Поле заполнено неверно"
              htmlFor="floating-error"
              label="Телефон"
              labelPlacement="floating"
            >
              <Input id="floating-error" variant="error" />
            </Field>
          </DemoRow>
        </DemoBlock>

        <hr className="border-border" />

        {/* ── Autocomplete ────────────────────────────────────────────── */}
        <DemoBlock title="Autocomplete">
          <DemoRow>
            <DemoField label="useStaticOptions">
              <DemoEmittedValue value={autoCountry} />
              <Autocomplete
                {...staticCountryProps}
                value={autoCountry}
                onChange={setAutoCountry}
                placeholder="Начните вводить..."
              />
            </DemoField>
            <DemoField label="useStaticOptions + phoneMask">
              <DemoEmittedValue value={autoPhone} />
              <Autocomplete
                {...staticPhoneProps}
                mask={phoneMask}
                value={autoPhone}
                onChange={setAutoPhone}
                placeholder="+7 (___) ___-__-__"
              />
            </DemoField>
            <DemoField label="useAsyncOptions">
              <DemoEmittedValue value={asyncCountry} />
              <Autocomplete
                {...asyncCountryProps}
                value={asyncCountry}
                onChange={setAsyncCountry}
                placeholder="Серверный поиск..."
              />
            </DemoField>
          </DemoRow>
        </DemoBlock>
      </CardContent>
    </Card>
  );
};
