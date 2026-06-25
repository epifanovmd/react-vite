import * as React from "react";

import type { SelectDataProps, SelectOption } from "../types";
import { filterByLabel } from "./filterByLabel";

export interface UseEagerOptionsConfig<TData, V extends string> {
  fetch: (signal: AbortSignal) => Promise<TData[]>;
  getOption: (item: TData) => SelectOption<V>;
  search?: boolean;
  fetchKey?: string | number;
}

export function useEagerOptions<TData, V extends string>({
  fetch,
  getOption,
  search,
  fetchKey,
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
