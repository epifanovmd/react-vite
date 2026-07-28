import * as React from "react";

import type { SelectDataProps, SelectOption, SelectValue } from "../types";

export interface UseAsyncOptionsConfig<TData, V extends SelectValue> {
  fetch: (query: string, signal: AbortSignal) => Promise<TData[]>;
  getOption: (item: TData) => SelectOption<V>;
  debounce?: number;
  loadOnce?: boolean;
  deps?: React.DependencyList;
  refetchInterval?: number;
  fetchOnMount?: boolean;
  minQueryLength?: number;
}

export function useAsyncOptions<TData, V extends SelectValue>({
  fetch,
  getOption,
  debounce = 300,
  loadOnce = false,
  deps = [],
  refetchInterval,
  fetchOnMount = false,
  minQueryLength = 0,
}: UseAsyncOptionsConfig<TData, V>): SelectDataProps<V> {
  const [options, setOptions] = React.useState<SelectOption<V>[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const fetchRef = React.useRef(fetch);
  const getOptionRef = React.useRef(getOption);
  const loadedRef = React.useRef(false);
  const mountedRef = React.useRef(false);

  fetchRef.current = fetch;
  getOptionRef.current = getOption;

  const doFetch = React.useCallback(
    async (q: string, signal: AbortSignal, keepOptions?: boolean) => {
      if (!keepOptions) setOptions([]);

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
    },
    [],
  );

  // Сброс loadedRef при изменении deps
  React.useEffect(() => {
    loadedRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // fetchOnMount — отдельный эффект, не зависит от open
  React.useEffect(() => {
    if (!fetchOnMount) return;

    const ctrl = new AbortController();

    if (!mountedRef.current) {
      mountedRef.current = true;
      doFetch("", ctrl.signal, true);
    }

    return () => {
      ctrl.abort();
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOnMount, ...deps]);

  // Open / query — основной fetch
  React.useEffect(() => {
    if (!open) return;

    // Если fetchOnMount уже загрузил данные, не фетчим при открытии
    if (fetchOnMount && loadedRef.current && query === "") return;

    // loadOnce — кеш, не перезапрашиваем
    if (loadOnce && loadedRef.current && query === "") return;

    // minQueryLength — не фетчить пока недостаточно символов
    if (query.length < minQueryLength) return;

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
  }, [open, query, debounce, loadOnce, minQueryLength, doFetch, fetchOnMount, ...deps]);

  // refetchInterval — поллинг пока открыт
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
