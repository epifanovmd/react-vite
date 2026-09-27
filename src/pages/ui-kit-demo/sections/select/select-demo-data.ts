export const FRUITS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry (disabled)", disabled: true },
  { value: "mango", label: "Mango" },
  { value: "orange", label: "Orange" },
  { value: "peach", label: "Peach" },
];

export const MANY_TAGS = Array.from({ length: 20 }, (_, i) => ({
  value: `tag-${i + 1}`,
  label: `Tag ${i + 1}`,
}));

export const COUNTRIES = [
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

export const CITIES = [
  "Moscow",
  "New York",
  "London",
  "Paris",
  "Tokyo",
  "Berlin",
];

export const ALL_USERS = Array.from({ length: 200 }, (_, i) => `User ${i + 1}`);

/** Имитация сетевой задержки для демо-загрузчиков. */
export const delay = <T>(value: T, ms: number): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(value), ms));

/** Длинный список для демо виртуализации. */
export const MANY_OPTIONS = Array.from({ length: 10_000 }, (_, i) => ({
  value: `item-${i + 1}`,
  label: `Опция ${i + 1}`,
}));

const GROUP_SIZE = 1_000;

export const MANY_OPTION_GROUPS = Array.from(
  { length: MANY_OPTIONS.length / GROUP_SIZE },
  (_, g) => ({
    group: `Диапазон ${g * GROUP_SIZE + 1}–${(g + 1) * GROUP_SIZE}`,
    options: MANY_OPTIONS.slice(g * GROUP_SIZE, (g + 1) * GROUP_SIZE),
  }),
);
