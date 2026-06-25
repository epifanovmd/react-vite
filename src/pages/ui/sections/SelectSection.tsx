import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  GroupedSelect,
  Select,
  useAsyncOptions,
  useControlledOptions,
  useEagerOptions,
  useInfiniteOptions,
  useStaticOptions,
} from "@components/ui";
import { FC, ReactNode, useState } from "react";

// ─── Demo data ──────────────────────────────────────────────────────────────

const BASIC = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const FRUITS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry (disabled)", disabled: true },
  { value: "mango", label: "Mango" },
  { value: "orange", label: "Orange" },
  { value: "peach", label: "Peach" },
];

const COLORS = [
  { id: "red", name: "Red" },
  { id: "green", name: "Green" },
  { id: "blue", name: "Blue" },
  { id: "purple", name: "Purple" },
];

const COUNTRIES = [
  "Russia",
  "USA",
  "China",
  "Germany",
  "France",
  "Japan",
  "UK",
  "Italy",
  "Canada",
  "Spain",
];

const CITIES = ["Moscow", "New York", "London", "Paris", "Tokyo", "Berlin"];

const ALL_USERS = Array.from({ length: 200 }, (_, i) => `User ${i + 1}`);

const delay = <T,>(value: T, ms: number): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(value), ms));

const fetchCountries = (query: string): Promise<string[]> =>
  delay(
    COUNTRIES.filter(c => c.toLowerCase().includes(query.toLowerCase())),
    700,
  );

const fetchCities = (): Promise<string[]> => delay(CITIES, 900);

const fetchUsersPage = (query: string, page: number): Promise<string[]> =>
  delay(
    ALL_USERS.filter(u => u.toLowerCase().includes(query.toLowerCase())).slice(
      page * 20,
      page * 20 + 20,
    ),
    600,
  );

// ─── Layout helpers ───────────────────────────────────────────────────────────

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <p className="text-xs text-muted-foreground">{label}</p>
    {children}
  </div>
);

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">{title}</CardTitle>
      <CardDescription className="text-xs">{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

// ─── Section: appearance ──────────────────────────────────────────────────────

const Appearance: FC = () => (
  <Section title="Внешний вид" description="Варианты состояния и размеры">
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 items-start">
        {(
          [
            "default",
            "filled",
            "filled-error",
            "filled-success",
            "error",
            "success",
          ] as const
        ).map(variant => (
          <Field key={variant} label={variant}>
            <Select options={BASIC} placeholder={variant} variant={variant} />
          </Field>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 items-start">
        {(["sm", "md", "lg"] as const).map(size => (
          <Field key={size} label={`size: ${size}`}>
            <Select options={BASIC} placeholder={size} size={size} />
          </Field>
        ))}
      </div>
    </div>
  </Section>
);

// ─── Section: capabilities ────────────────────────────────────────────────────

const Capabilities: FC = () => {
  const [basic, setBasic] = useState<string>();
  const [searchSingle, setSearchSingle] = useState<string>();
  const [clearable, setClearable] = useState<string | null>("option2");
  const [multi, setMulti] = useState<string[]>(["apple", "mango"]);
  const [multiComma, setMultiComma] = useState<string[]>(["apple", "orange"]);

  const searchable = useStaticOptions(FRUITS, { search: true });
  const multiSearch = useStaticOptions(FRUITS, { search: true });

  return (
    <Section
      title="Возможности"
      description="Поиск, очистка, мульти-выбор, disabled / loading / empty"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-start">
        <Field label="Базовый (single)">
          <Select
            options={FRUITS}
            value={basic}
            onChange={setBasic}
            placeholder="Выберите фрукт"
          />
        </Field>

        <Field label="Clearable (крестик очистки)">
          <Select
            options={FRUITS}
            clearable
            value={clearable}
            onChange={setClearable}
            placeholder="Можно очистить"
          />
        </Field>

        <Field label="С поиском (single)">
          <Select
            {...searchable}
            value={searchSingle}
            onChange={setSearchSingle}
            placeholder="Печатайте для поиска"
          />
        </Field>

        <Field label="Disabled">
          <Select options={FRUITS} disabled placeholder="Недоступно" />
        </Field>

        <Field label="Multi (теги)">
          <Select
            multi
            options={FRUITS}
            value={multi}
            onChange={setMulti}
            placeholder="Несколько значений"
          />
        </Field>

        <Field label="Multi + поиск + clearable">
          <Select
            {...multiSearch}
            multi
            clearable
            value={multi}
            onChange={setMulti}
            placeholder="Поиск по тегам"
          />
        </Field>

        <Field label="Multi без тегов (через запятую)">
          <Select
            multi
            tagsDisplay={false}
            options={FRUITS}
            value={multiComma}
            onChange={setMultiComma}
            placeholder="Список через запятую"
          />
        </Field>

        <Field label="Loading">
          <Select options={[]} loading placeholder="Загрузка…" />
        </Field>

        <Field label="Empty (нет опций)">
          <Select options={[]} placeholder="Пусто" empty="Ничего не найдено" />
        </Field>
      </div>
    </Section>
  );
};

// ─── Section: strategies ──────────────────────────────────────────────────────

const Strategies: FC = () => {
  const [vStatic, setVStatic] = useState<string>();
  const [vControlled, setVControlled] = useState<string>();
  const [vEager, setVEager] = useState<string>();
  const [vAsync, setVAsync] = useState<string>();
  const [vOnce, setVOnce] = useState<string>();
  const [vInfinite, setVInfinite] = useState<string>();

  const staticSearch = useStaticOptions(FRUITS, { search: true });

  const controlled = useControlledOptions({
    data: COLORS,
    getOption: c => ({ value: c.id, label: c.name }),
    search: true,
  });

  const eager = useEagerOptions({
    fetch: () => fetchCities(),
    getOption: c => ({ value: c, label: c }),
    search: true,
  });

  const asyncSearch = useAsyncOptions({
    fetch: (query, _signal) => fetchCountries(query),
    getOption: c => ({ value: c, label: c }),
  });

  const asyncOnce = useAsyncOptions({
    fetch: (_query, _signal) => fetchCountries(""),
    getOption: c => ({ value: c, label: c }),
    loadOnce: true,
  });

  const infinite = useInfiniteOptions({
    fetchPage: (query, page) => fetchUsersPage(query, page),
    getOption: u => ({ value: u, label: u }),
    pageSize: 20,
  });

  return (
    <Section
      title="Стратегии загрузки"
      description="Каждый селект получает данные из своего хука (результат = пропсы для спреда)"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-start">
        <Field label="useStaticOptions — массив + клиентский поиск">
          <Select
            {...staticSearch}
            value={vStatic}
            onChange={setVStatic}
            placeholder="Static + search"
          />
        </Field>

        <Field label="useControlledOptions — свои данные + map">
          <Select
            {...controlled}
            value={vControlled}
            onChange={setVControlled}
            placeholder="Bring your own data"
          />
        </Field>

        <Field label="useEagerOptions — загрузка всего один раз">
          <Select
            {...eager}
            value={vEager}
            onChange={setVEager}
            placeholder="Eager (on mount)"
          />
        </Field>

        <Field label="useAsyncOptions — серверный поиск on-open">
          <Select
            {...asyncSearch}
            value={vAsync}
            onChange={setVAsync}
            placeholder="Async (server search)"
          />
        </Field>

        <Field label="useAsyncOptions + loadOnce — кеш после первого открытия">
          <Select
            {...asyncOnce}
            value={vOnce}
            onChange={setVOnce}
            placeholder="Async (load once)"
          />
        </Field>

        <Field label="useInfiniteOptions — пагинация по скроллу">
          <Select
            {...infinite}
            value={vInfinite}
            onChange={setVInfinite}
            placeholder="Infinite scroll"
          />
        </Field>
      </div>
    </Section>
  );
};

// ─── Section: grouped ─────────────────────────────────────────────────────────

const Grouped: FC = () => {
  const [value, setValue] = useState<string>();

  return (
    <Section title="Grouped" description="Опции, сгруппированные по категориям">
      <div className="max-w-xs">
        <GroupedSelect
          value={value}
          onChange={setValue}
          groups={[
            {
              group: "Fruits",
              options: [
                { value: "apple", label: "Apple" },
                { value: "banana", label: "Banana" },
              ],
            },
            {
              group: "Vegetables",
              options: [
                { value: "carrot", label: "Carrot" },
                { value: "broccoli", label: "Broccoli" },
              ],
            },
          ]}
          placeholder="Grouped"
        />
      </div>
    </Section>
  );
};

// ─── Public ───────────────────────────────────────────────────────────────────

export const SelectSection: FC = () => (
  <div className="flex flex-col gap-4">
    <Appearance />
    <Capabilities />
    <Strategies />
    <Grouped />
  </div>
);
