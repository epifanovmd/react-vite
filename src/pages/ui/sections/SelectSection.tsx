import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  GroupedSelect,
  type ISelectRef,
  type LabeledValue,
  Select,
  useAsyncOptions,
  useControlledOptions,
  useDependentOptions,
  useEagerOptions,
  useInfiniteOptions,
  useStaticOptions,
} from "@components/ui";
import { type FC, type ReactNode, useRef, useState } from "react";

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

const LONG_OPTIONS = [
  { value: "opt1", label: "Производство электрооборудования" },
  { value: "opt2", label: "Оптовая торговля стройматериалами" },
  { value: "opt3", label: "Деятельность в области информационных технологий" },
];

const MANY_TAGS = Array.from({ length: 20 }, (_, i) => ({
  value: `tag-${i + 1}`,
  label: `Tag ${i + 1}`,
}));

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

const LANGUAGES = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "he", name: "Hebrew", dir: "rtl" },
  { code: "ar", name: "Arabic", dir: "rtl" },
  { code: "ja", name: "Japanese", dir: "ltr" },
  { code: "ru", name: "Russian", dir: "ltr" },
];

const DEPENDENT_DATA: Record<string, string[]> = {
  electronics: ["Смартфоны", "Ноутбуки", "Наушники", "Зарядки"],
  clothing: ["Футболки", "Джинсы", "Куртки", "Обувь"],
  books: ["Художественная", "Техническая", "Детская"],
};

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

const Row = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-start">
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
      <div className="grid grid-cols-2 gap-3 items-start">
        <Field label="valid (успех)">
          <Select options={BASIC} placeholder="Валидно" valid />
        </Field>
        <Field label="valid (ошибка)">
          <Select options={BASIC} placeholder="Ошибка" valid={false} />
        </Field>
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
  const [deselectedLog, setDeselectedLog] = useState<string[]>([]);
  const [focusCount, setFocusCount] = useState(0);
  const [blurCount, setBlurCount] = useState(0);

  const [multiSelect, setMultiSelect] = useState<string[]>(["apple"]);
  const [multiMax, setMultiMax] = useState<string[]>([]);

  const searchable = useStaticOptions(FRUITS, { search: true });
  const multiSearch = useStaticOptions(FRUITS, { search: true });

  return (
    <Section
      title="Возможности"
      description="Поиск, очистка, мульти-выбор, колбэки"
    >
      <div className="flex flex-col gap-4">
        <Row>
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
        </Row>

        <Row>
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

          <Field label={`maxTagCount=3 (${MANY_TAGS.length} опций)`}>
            <Select
              multi
              maxTagCount={3}
              options={MANY_TAGS}
              value={multiMax}
              onChange={setMultiMax}
              placeholder="Ограничение тегов"
            />
          </Field>
        </Row>

        <Row>
          <Field label="Loading">
            <Select options={[]} loading placeholder="Загрузка…" />
          </Field>

          <Field label="Empty (нет опций)">
            <Select
              options={[]}
              placeholder="Пусто"
              empty="Ничего не найдено"
            />
          </Field>
        </Row>

        <Row>
          <Field label="onSelect / onDeselect (multi)">
            <Select
              multi
              clearable
              options={FRUITS}
              value={multiSelect}
              onChange={setMultiSelect}
              placeholder="Выберите фрукты"
              onSelect={(v, opt) => console.log("onSelect:", v, opt.label)}
              onDeselect={(v, opt) =>
                setDeselectedLog(prev => [
                  ...prev.slice(-4),
                  `${opt.label} ×`,
                ])
              }
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              выбрано: {multiSelect.join(", ") || "—"} | deselect:{" "}
              {deselectedLog.length > 0
                ? deselectedLog.join(", ")
                : "—"}
            </p>
          </Field>

          <Field label="onFocus / onBlur">
            <Select
              options={FRUITS}
              placeholder="Фокус / blur"
              onFocus={() => setFocusCount(c => c + 1)}
              onBlur={() => setBlurCount(c => c + 1)}
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              focus: {focusCount} | blur: {blurCount}
            </p>
          </Field>
        </Row>
      </div>
    </Section>
  );
};

// ─── Section: optionRender + custom search ───────────────────────────────────

const CustomRendering: FC = () => {
  const [value, setValue] = useState<string>();

  return (
    <Section
      title="Кастомный рендер"
      description="optionRender и filterOption с предикатом"
    >
      <div className="flex flex-col gap-4">
        <Row>
          <Field label="optionRender — иконка + цветной label">
            <Select
              options={FRUITS}
              value={value}
              onChange={setValue}
              placeholder="Выберите фрукт"
              optionRender={({ option, selected, focused }) => (
                <span
                  className={
                    selected
                      ? "text-orange-600 font-semibold"
                      : focused
                        ? "text-blue-600"
                        : undefined
                  }
                >
                  {option.value === "apple"
                    ? "🍎 "
                    : option.value === "banana"
                      ? "🍌 "
                      : option.value === "cherry"
                        ? "🍒 "
                        : option.value === "mango"
                          ? "🥭 "
                          : option.value === "orange"
                            ? "🍊 "
                            : option.value === "peach"
                              ? "🍑 "
                              : ""}
                  {String(option.label)}
                </span>
              )}
            />
          </Field>

          <Field label="optionRender в GroupedSelect">
            <GroupedSelect
              placeholder="Выберите"
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
              optionRender={({ option }) => (
                <span className="uppercase text-[10px] tracking-wider">
                  {String(option.label)}
                </span>
              )}
            />
          </Field>
        </Row>

        <Row>
          <Field label="filterOption — поиск по коду или имени">
            <SelectWithCustomFilter />
          </Field>

          <Field label="filterOption=false — без фильтрации">
            <SelectWithoutFilter />
          </Field>
        </Row>
      </div>
    </Section>
  );
};

const LANG_OPTIONS = LANGUAGES.map(l => ({
  value: l.code,
  label: `${l.name} (${l.code}) — ${l.dir}`,
}));

const SelectWithCustomFilter: FC = () => {
  const [value, setValue] = useState<string>();
  const filtered = useStaticOptions(LANG_OPTIONS, {
    search: true,
    filterOption: (query, opt) => {
      const q = query.toLowerCase();
      const item = LANGUAGES.find(l => l.code === opt.value);

      return (
        !item ||
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.dir.toLowerCase().includes(q)
      );
    },
  });

  return (
    <Select
      {...filtered}
      value={value}
      onChange={setValue}
      placeholder="Поиск по name / code / dir"
    />
  );
};

const SelectWithoutFilter: FC = () => {
  const [value, setValue] = useState<string>();
  const data = useStaticOptions(FRUITS, {
    search: true,
    filterOption: false,
  });

  return (
    <div className="flex flex-col gap-1">
      <Select
        {...data}
        value={value}
        onChange={setValue}
        placeholder="Фильтрация отключена"
      />
      <p className="text-[10px] text-muted-foreground">
        search включён, но filterOption=false — список не фильтруется
      </p>
    </div>
  );
};

// ─── Section: ref API ────────────────────────────────────────────────────────

const RefApi: FC = () => {
  const ref = useRef<ISelectRef>(null);
  const [refValue, setRefValue] = useState<string>();
  const [scrollIdx, setScrollIdx] = useState(0);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  return (
    <Section title="Ref API" description="focus, blur, scrollTo, nativeElement">
      <div className="flex flex-col gap-3">
        <Field label="Select с search, чтобы видеть открытие/закрытие">
          <Select
            ref={ref}
            options={MANY_TAGS}
            value={refValue}
            onChange={setRefValue}
            placeholder="Используйте кнопки ниже"
            search
            onFocus={() => setFocusedId("focus")}
            onBlur={() => setFocusedId("blur")}
          />
        </Field>
        <p className="text-[10px] text-muted-foreground -mt-2">
          {focusedId === "focus"
            ? "🟢 focus"
            : focusedId === "blur"
              ? "🔴 blur"
              : "⚪ idle"}
          {selectedTag && ` | scrollTo: index ${selectedTag}`}
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            className="rounded-md border px-3 py-1 text-xs hover:bg-accent"
            onClick={() => ref.current?.focus()}
          >
            focus()
          </button>
          <button
            className="rounded-md border px-3 py-1 text-xs hover:bg-accent"
            onClick={() => ref.current?.blur()}
          >
            blur()
          </button>
          <button
            className="rounded-md border px-3 py-1 text-xs hover:bg-accent"
            onClick={() => {
              ref.current?.focus();
              setTimeout(() => {
                ref.current?.scrollTo(scrollIdx);
                setSelectedTag(`Tag ${scrollIdx + 1}`);
              }, 100);
            }}
          >
            scrollTo({scrollIdx})
          </button>
          <input
            className="w-16 rounded-md border px-2 py-1 text-xs"
            type="number"
            min={0}
            max={MANY_TAGS.length - 1}
            value={scrollIdx}
            onChange={e => setScrollIdx(Number(e.target.value))}
          />
          <button
            className="rounded-md border px-3 py-1 text-xs hover:bg-accent"
            onClick={() =>
              console.log(
                "nativeElement:",
                ref.current?.nativeElement,
              )
            }
          >
            nativeElement (console)
          </button>
        </div>
      </div>
    </Section>
  );
};

// ─── Section: labelInValue ───────────────────────────────────────────────────

const LabelInValue: FC = () => {
  const [labeledValue, setLabeledValue] = useState<LabeledValue<string> | null>(
    null,
  );

  return (
    <Section
      title="labelInValue"
      description="onChange возвращает LabeledValue<V> с label/key/disabled"
    >
      <Field label="labelInValue — значение с меткой">
        <Select<string>
          options={FRUITS}
          labelInValue
          clearable
          value={labeledValue}
          onChange={(v: LabeledValue<string> | null) => setLabeledValue(v)}
          placeholder="Выберите фрукт"
        />
        <pre className="mt-1 rounded bg-muted p-2 text-[10px] overflow-x-auto">
          {JSON.stringify(labeledValue, null, 2)}
        </pre>
      </Field>
    </Section>
  );
};

// ─── Section: dropdown positioning ───────────────────────────────────────────

const SIDES = ["bottom", "top", "left", "right"] as const;
const ALIGNS = ["start", "center", "end"] as const;

const DropdownPositioning: FC = () => {
  const [v1, setV1] = useState<string>();
  const [v2, setV2] = useState<string>();
  const [v3, setV3] = useState<string>();
  const [v4, setV4] = useState<string>();
  const [v5, setV5] = useState<string>();

  return (
    <Section
      title="Позиционирование дропдауна"
      description="dropdownSide, dropdownAlign, dropdownWidth, dropdownMaxWidth"
    >
      <div className="flex flex-col gap-4">
        <p className="text-xs text-muted-foreground font-medium">
          dropdownSide — все 4 стороны
        </p>
        <Row>
          {SIDES.map(side => (
            <Field key={side} label={`dropdownSide="${side}"`}>
              <Select
                options={FRUITS}
                value={v1}
                onChange={setV1}
                placeholder={side}
                dropdownSide={side}
                dropdownWidth="auto"
                dropdownCollisionPadding={8}
              />
            </Field>
          ))}
        </Row>

        <p className="text-xs text-muted-foreground font-medium">
          dropdownAlign — длинные опции, дропдаун шире триггера
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          {ALIGNS.map(align => (
            <div key={align} className="max-w-[140px]">
              <Field label={`dropdownAlign="${align}"`}>
                <Select
                  options={LONG_OPTIONS}
                  value={v2}
                  onChange={setV2}
                  placeholder={align}
                  dropdownSide="bottom"
                  dropdownAlign={align}
                  dropdownWidth="auto"
                  dropdownCollisionPadding={8}
                />
              </Field>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground font-medium">
          dropdownWidth — варианты ширины
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
          <Field label='dropdownWidth="trigger" (default)'>
            <Select
              options={FRUITS}
              value={v3}
              onChange={setV3}
              placeholder="Как триггер"
            />
          </Field>
          <Field label='dropdownWidth="auto" — короткие опции'>
            <Select
              options={FRUITS}
              value={v4}
              onChange={setV4}
              placeholder="По контенту"
              dropdownWidth="auto"
            />
          </Field>
          <Field label='dropdownWidth="auto" — длинные опции'>
            <Select
              options={LONG_OPTIONS}
              placeholder="По контенту"
              dropdownWidth="auto"
            />
          </Field>
          <Field label="dropdownWidth={280} — фикс 280px">
            <Select
              options={FRUITS}
              value={v5}
              onChange={setV5}
              placeholder="Фиксированная ширина"
              dropdownWidth={280}
            />
          </Field>
          <Field label="dropdownMaxWidth={160} — максимум 160px">
            <Select
              options={FRUITS}
              placeholder="Узкий максимум"
              dropdownWidth="auto"
              dropdownMaxWidth={160}
            />
          </Field>
        </div>
      </div>
    </Section>
  );
};

// ─── Section: strategies (extended) ──────────────────────────────────────────

const StrategiesExt: FC = () => {
  const [vStatic, setVStatic] = useState<string>();
  const [vControlled, setVControlled] = useState<string>();
  const [vEager, setVEager] = useState<string>();
  const [vAsync, setVAsync] = useState<string>();
  const [vOnce, setVOnce] = useState<string>();
  const [vInfinite, setVInfinite] = useState<string>();

  // Extended strategy configs
  const [vFetchMount, setVFetchMount] = useState<string>();
  const [vMinQL, setVMinQL] = useState<string>();
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

  // Extended: fetchOnMount
  const asyncFetchMount = useAsyncOptions({
    fetch: (query, _signal) => fetchCountries(query),
    getOption: c => ({ value: c, label: c }),
    fetchOnMount: true,
  });

  // Extended: minQueryLength
  const asyncMinQL = useAsyncOptions({
    fetch: (query, _signal) => fetchCountries(query),
    getOption: c => ({ value: c, label: c }),
    minQueryLength: 3,
  });

  return (
    <Section
      title="Стратегии загрузки"
      description="Базовые и расширенные стратегии"
    >
      <div className="flex flex-col gap-4">
        <p className="text-xs text-muted-foreground font-medium">Базовые</p>
        <Row>
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
        </Row>

        <Row>
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
        </Row>

        <Row>
          <Field label="useAsyncOptions + loadOnce + hideEmpty">
            <Select
              {...asyncOnce}
              value={vOnce}
              onChange={setVOnce}
              placeholder="Async (load once)"
              hideEmpty
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
        </Row>

        <p className="text-xs text-muted-foreground font-medium mt-2">
          Расширенные
        </p>
        <Row>
          <Field label="useAsyncOptions + fetchOnMount — загрузка при монтировании">
            <Select
              {...asyncFetchMount}
              value={vFetchMount}
              onChange={setVFetchMount}
              placeholder="fetchOnMount (см. console)"
            />
          </Field>
          <Field label="useAsyncOptions + minQueryLength=3 — минимум 3 символа">
            <Select
              {...asyncMinQL}
              value={vMinQL}
              onChange={setVMinQL}
              placeholder="Введите минимум 3 символа"
            />
          </Field>
        </Row>
      </div>
    </Section>
  );
};

// ─── Section: dependent options ──────────────────────────────────────────────

const Dependent: FC = () => {
  const [category, setCategory] = useState<string>();
  const [subcategory, setSubcategory] = useState<string>();

  const subs = useDependentOptions({
    dependsOn: category,
    fetch: (cat: string) =>
      delay(DEPENDENT_DATA[cat as keyof typeof DEPENDENT_DATA] ?? [], 500),
    getOption: (item: string) => ({ value: item, label: item }),
  });

  const handleCategoryChange = (cat: string | null) => {
    setCategory(cat ?? undefined);
    setSubcategory(undefined);
  };

  return (
    <Section
      title="Зависимые опции"
      description="useDependentOptions — выбор категории влияет на список подкатегорий"
    >
      <div className="flex flex-col gap-3">
        <Row>
          <Field label="Категория">
            <Select
              options={[
                { value: "electronics", label: "Электроника" },
                { value: "clothing", label: "Одежда" },
                { value: "books", label: "Книги" },
              ]}
              value={category}
              onChange={handleCategoryChange}
              clearable
              placeholder="Выберите категорию"
            />
          </Field>

          <Field label="Подкатегория (+ hideEmpty)">
            <Select
              {...subs}
              value={subcategory}
              onChange={setSubcategory}
              hideEmpty
              placeholder={
                !category
                  ? "Сначала выберите категорию"
                  : subs.loading
                    ? "Загрузка..."
                    : "Выберите подкатегорию"
              }
            />
          </Field>
        </Row>
        <p className="text-[10px] text-muted-foreground">
          {!category
            ? "Выберите категорию, чтобы загрузить подкатегории"
            : subs.loading
              ? "Загрузка..."
              : `Загружено ${(subs.options ?? []).length} подкатегорий`}
        </p>
      </div>
    </Section>
  );
};

// ─── Section: grouped// ─── Section: grouped ─────────────────────────────────────────────────────────

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
    <CustomRendering />
    <RefApi />
    <LabelInValue />
    <DropdownPositioning />
    <StrategiesExt />
    <Dependent />
    <Grouped />
  </div>
);
