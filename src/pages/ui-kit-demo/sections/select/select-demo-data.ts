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
