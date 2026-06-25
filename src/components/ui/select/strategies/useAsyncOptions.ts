import * as React from "react";

import type { SelectDataProps, SelectOption, SelectValue } from "../types";

export interface UseAsyncOptionsConfig<TData, V extends SelectValue> {
  fetch: (query: string, signal: AbortSignal) => Promise<TData[]>;
  getOption: (item: TData) => SelectOption<V>;
  debounce?: number;
  loadOnce?: boolean;
  deps?: React.DependencyList;
  refetchInterval?: number;
}

export function useAsyncOptions<TData, V extends SelectValue>({
  fetch,
  getOption,
  debounce = 300,
  loadOnce = false,
  deps = [],
  refetchInterval,
}: UseAsyncOptionsConfig<TData, V>): SelectDataProps<V> {
  const [options, setOptions] = React.useState<SelectOption<V>[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const fetchRef = React.useRef(fetch);
  const getOptionRef = React.useRef(getOption);
  const loadedRef = React.useRef(false);

  fetchRef.current = fetch;
  getOptionRef.current = getOption;

  const doFetch = React.useCallback(async (q: string, signal: AbortSignal) => {
    setLoading(true);
    try {
      const data = await fetchRef.current(q, signal);

      if (!signal.aborted) {
        setOptions(data.map(item => getOptionRef.current(item)));
        loadedRef.current = true;
      }
    } catch {
      if (!signal.aborted) setOptions([]);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadedRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  React.useEffect(() => {
    if (!open) return;
    if (loadOnce && loadedRef.current && query === "") return;

    const ctrl = new AbortController();
    const timer = setTimeout(
      () => doFetch(query, ctrl.signal),
      query ? debounce : 0,
    );

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, query, debounce, loadOnce, doFetch, ...deps]);

  React.useEffect(() => {
    if (!refetchInterval || !open) return;

    const id = setInterval(() => {
      const ctrl = new AbortController();

      doFetch(query, ctrl.signal);
    }, refetchInterval);

    return () => clearInterval(id);
  }, [refetchInterval, open, query, doFetch]);

  return {
    options,
    loading,
    search: true,
    searchValue: query,
    onSearch: setQuery,
    onOpenChange: setOpen,
  };
}
