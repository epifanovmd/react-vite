import * as React from "react";

import type { SelectDataProps, SelectOption, SelectValue } from "../types";
import { filterByLabel } from "./filterByLabel";

export interface UseControlledOptionsConfig<TData, V extends SelectValue> {
  data: TData[] | undefined;
  getOption: (item: TData) => SelectOption<V>;
  loading?: boolean;
  search?: boolean;
}

export function useControlledOptions<TData, V extends SelectValue>({
  data,
  getOption,
  loading,
  search,
}: UseControlledOptionsConfig<TData, V>): SelectDataProps<V> {
  const [query, setQuery] = React.useState("");

  const all = React.useMemo(
    () => (data ?? []).map(getOption),
    [data, getOption],
  );

  const filtered = React.useMemo(
    () => (search ? filterByLabel(all, query) : all),
    [all, query, search],
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
