import * as React from "react";

import type {
  FilterOptionPredicate,
  SelectDataProps,
  SelectOption,
  SelectValue,
} from "../types";
import { filterByLabel } from "./filterByLabel";

export interface UseDependentOptionsConfig<TData, V extends SelectValue> {
  /** Значение, от которого зависят опции. При изменении — перезагрузка. */
  dependsOn: any;
  /** Загрузчик, принимает текущее `dependsOn`. */
  fetch: (dep: any) => Promise<TData[]>;
  /** Маппер элемента в SelectOption. */
  getOption: (item: TData) => SelectOption<V>;
  /** Включить строку поиска. */
  search?: boolean;
  /** Фильтр опций. */
  filterOption?: boolean | FilterOptionPredicate<V>;
  /** Дефолтные опции (пока грузятся, показать их). */
  placeholderOptions?: SelectOption<V>[];
}

/**
 * Каскадные / зависимые опции.
 * Автоматически перезагружает список при изменении `dependsOn`.
 * Пока грузятся новые данные — показывает `placeholderOptions` (если передан).
 */
export function useDependentOptions<TData, V extends SelectValue>({
  dependsOn,
  fetch,
  getOption,
  search,
  filterOption,
  placeholderOptions,
}: UseDependentOptionsConfig<TData, V>): SelectDataProps<V> {
  const [data, setData] = React.useState<TData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (dependsOn == null) {
      setData([]);

      return;
    }

    let cancelled = false;

    setLoading(true);
    fetch(dependsOn)
      .then(d => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setData([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependsOn]);

  const all = React.useMemo(
    () => (data.length > 0 ? data.map(getOption) : placeholderOptions ?? []),
    [data, getOption, placeholderOptions],
  );

  const doFilter = search && filterOption !== false;

  const predicate =
    typeof filterOption === "function" ? filterOption : undefined;

  const filtered = React.useMemo(
    () => (doFilter ? filterByLabel(all, query, predicate) : all),
    [all, query, doFilter, predicate],
  );

  const isEmpty = data.length === 0 && !placeholderOptions;
  const showLoading = loading && isEmpty;

  if (!search)
    return { options: showLoading ? [] : all, loading: showLoading || loading };

  return {
    options: showLoading ? [] : filtered,
    loading: showLoading || loading,
    search: true,
    searchValue: query,
    onSearch: setQuery,
  };
}
