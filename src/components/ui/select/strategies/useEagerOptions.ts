import * as React from "react";

import type {
  FilterOptionPredicate,
  SelectDataProps,
  SelectOption,
  SelectValue,
} from "../types";
import { filterByLabel } from "./filterByLabel";

export interface UseEagerOptionsConfig<TData, V extends SelectValue> {
  fetch: (signal: AbortSignal) => Promise<TData[]>;
  getOption: (item: TData) => SelectOption<V>;
  search?: boolean;
  fetchKey?: string | number;
  filterOption?: boolean | FilterOptionPredicate<V>;
}

export function useEagerOptions<TData, V extends SelectValue>({
  fetch,
  getOption,
  search,
  fetchKey,
  filterOption,
}: UseEagerOptionsConfig<TData, V>): SelectDataProps<V> {
  const [data, setData] = React.useState<TData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");

  const fetchRef = React.useRef(fetch);
  const getOptionRef = React.useRef(getOption);

  fetchRef.current = fetch;
  getOptionRef.current = getOption;

  React.useEffect(() => {
    const ctrl = new AbortController();

    setLoading(true);
    setData([]);

    fetchRef
      .current(ctrl.signal)
      .then(d => {
        if (!ctrl.signal.aborted) setData(d);
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setData([]);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
     
  }, [fetchKey]);

  const all = React.useMemo(
    () => data.map(item => getOptionRef.current(item)),
    [data],
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
