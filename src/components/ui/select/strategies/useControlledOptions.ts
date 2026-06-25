import * as React from "react";

import type {
  FilterOptionPredicate,
  SelectDataProps,
  SelectOption,
  SelectValue,
} from "../types";
import { filterByLabel } from "./filterByLabel";

export interface UseControlledOptionsConfig<TData, V extends SelectValue> {
  data: TData[] | undefined;
  getOption: (item: TData) => SelectOption<V>;
  loading?: boolean;
  search?: boolean;
  filterOption?: boolean | FilterOptionPredicate<V>;
}

export function useControlledOptions<TData, V extends SelectValue>({
  data,
  getOption,
  loading,
  search,
  filterOption,
}: UseControlledOptionsConfig<TData, V>): SelectDataProps<V> {
  const [query, setQuery] = React.useState("");

  const all = React.useMemo(
    () => (data ?? []).map(getOption),
    [data, getOption],
  );

  const doFilter = search && filterOption !== false;

  const predicate =
    typeof filterOption === "function" ? filterOption : undefined;

  const filtered = React.useMemo(
    () => (doFilter ? filterByLabel(all, query, predicate) : all),
    [all, query, doFilter, predicate],
  );

  if (!search) return { options: all, loading };

  return {
    options: filtered,
    loading,
    search: true,
    searchValue: query,
    onSearch: setQuery,
  };
}
