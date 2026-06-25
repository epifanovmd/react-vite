import type { SelectOption } from "../../types";

// Tagged-union для sync-источника: static-массив, getter-функция или ничего.
// Async-случай (fetchOptions) не входит сюда — у него отдельная ось (FetchPolicy).
export type SourceStrategy<V extends string> =
  | { kind: "static"; options: SelectOption<V>[] }
  | { kind: "getter"; fn: (q: string) => SelectOption<V>[] }
  | { kind: "none" };

// Выбор стратегии по форме optionsProp. Массив → static, функция → getter, иначе none.
export const pickSource = <V extends string>(
  optionsProp:
    | SelectOption<V>[]
    | ((q: string) => SelectOption<V>[])
    | undefined,
): SourceStrategy<V> => {
  if (Array.isArray(optionsProp))
    return { kind: "static", options: optionsProp };
  if (typeof optionsProp === "function")
    return { kind: "getter", fn: optionsProp };

  return { kind: "none" };
};

// Клиентская фильтрация статического массива по подстроке label (case-insensitive).
const filterByLabel = <V extends string>(
  list: SelectOption<V>[],
  query: string,
): SelectOption<V>[] => {
  const q = query.toLowerCase();

  return list.filter(o => String(o.label).toLowerCase().includes(q));
};

// Вычисляет актуальные опции по выбранному source. Чистая функция — мемоизируется
// снаружи через useMemo на (source, query, search).
export const resolveSource = <V extends string>(
  source: SourceStrategy<V>,
  query: string,
  search: boolean,
): SelectOption<V>[] => {
  switch (source.kind) {
    case "static":
      return search && query
        ? filterByLabel(source.options, query)
        : source.options;
    case "getter":
      return source.fn(query);
    case "none":
      return [];
  }
};
