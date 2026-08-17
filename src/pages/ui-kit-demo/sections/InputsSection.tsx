import {
  Autocomplete,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field as FormField,
  Input,
  phoneMask,
  useAsyncOptions,
  useStaticOptions,
} from "@shared/ui";
import { Search } from "lucide-react";
import { type FC, type ReactNode, useState } from "react";

const Row = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
    {children}
  </div>
);

const Field = ({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    {label && <p className="text-[10px] text-muted-foreground">{label}</p>}
    {children}
  </div>
);

const GroupTitle = ({ children }: { children: ReactNode }) => (
  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
    {children}
  </p>
);

// Реальное значение, которое отдаёт автокомплит через onChange
const EmittedValue = ({ value }: { value: string }) => (
  <p className="text-[10px] font-mono text-muted-foreground truncate">
    value: {value === "" ? "—" : `«${value}»`}
  </p>
);

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
        <div>
          <GroupTitle>Базовые</GroupTitle>
          <Row>
            <Field label="Default">
              <Input placeholder="Default input" />
            </Field>
            <Field label="С иконкой">
              <Input
                placeholder="With left icon"
                leftIcon={<Search className="h-4 w-4" />}
              />
            </Field>
            <Field label="Clearable">
              <Input
                placeholder="Clearable input"
                clearable
                onClear={() => {}}
              />
            </Field>
          </Row>
        </div>

        {/* ── Варианты ────────────────────────────────────────────────── */}
        <div>
          <GroupTitle>Варианты</GroupTitle>
          <Row>
            <Field label="Filled">
              <Input placeholder="Filled variant" variant="filled" />
            </Field>
            <Field label="Filled error">
              <Input placeholder="Filled error" variant="filled-error" />
            </Field>
            <Field label="Filled success">
              <Input placeholder="Filled success" variant="filled-success" />
            </Field>
          </Row>
        </div>

        {/* ── Состояния ───────────────────────────────────────────────── */}
        <div>
          <GroupTitle>Состояния</GroupTitle>
          <Row>
            <Field label="Error">
              <Input placeholder="Error state" variant="error" />
            </Field>
            <Field label="Success">
              <Input placeholder="Success state" variant="success" />
            </Field>
            <Field label="Disabled">
              <Input placeholder="Disabled" disabled />
            </Field>
          </Row>
        </div>

        {/* ── Особые ──────────────────────────────────────────────────── */}
        <div>
          <GroupTitle>Особые</GroupTitle>
          <Row>
            <Field label="Password">
              <Input type="password" placeholder="Password" />
            </Field>
            <Field label="Loading">
              <Input placeholder="Loading..." loading />
            </Field>
          </Row>
        </div>

        <div>
          <GroupTitle>Floating label</GroupTitle>
          <Row>
            <FormField
              htmlFor="floating-email"
              label="Email"
              labelPlacement="floating"
            >
              <Input id="floating-email" type="email" />
            </FormField>
            <FormField
              description="Label остаётся сверху после заполнения"
              htmlFor="floating-name"
              label="Имя"
              labelPlacement="floating"
              required
            >
              <Input id="floating-name" defaultValue="Андрей" />
            </FormField>
            <FormField
              error="Поле заполнено неверно"
              htmlFor="floating-error"
              label="Телефон"
              labelPlacement="floating"
            >
              <Input id="floating-error" variant="error" />
            </FormField>
          </Row>
        </div>

        <hr className="border-border" />

        {/* ── Autocomplete ────────────────────────────────────────────── */}
        <div>
          <GroupTitle>Autocomplete</GroupTitle>
          <Row>
            <Field label="useStaticOptions">
              <EmittedValue value={autoCountry} />
              <Autocomplete
                {...staticCountryProps}
                value={autoCountry}
                onChange={setAutoCountry}
                placeholder="Начните вводить..."
              />
            </Field>
            <Field label="useStaticOptions + phoneMask">
              <EmittedValue value={autoPhone} />
              <Autocomplete
                {...staticPhoneProps}
                mask={phoneMask}
                value={autoPhone}
                onChange={setAutoPhone}
                placeholder="+7 (___) ___-__-__"
              />
            </Field>
            <Field label="useAsyncOptions">
              <EmittedValue value={asyncCountry} />
              <Autocomplete
                {...asyncCountryProps}
                value={asyncCountry}
                onChange={setAsyncCountry}
                placeholder="Серверный поиск..."
              />
            </Field>
          </Row>
        </div>
      </CardContent>
    </Card>
  );
};
