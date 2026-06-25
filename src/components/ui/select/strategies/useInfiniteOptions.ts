import * as React from "react";

import type { SelectDataProps, SelectOption, SelectValue } from "../types";

export interface UseInfiniteOptionsConfig<TData, V extends SelectValue> {
  fetchPage: (
    query: string,
    page: number,
    signal: AbortSignal,
  ) => Promise<TData[]>;
  getOption: (item: TData) => SelectOption<V>;
  pageSize?: number;
  debounce?: number;
}

export function useInfiniteOptions<TData, V extends SelectValue>({
  fetchPage,
  getOption,
  pageSize = 20,
  debounce = 300,
}: UseInfiniteOptionsConfig<TData, V>): SelectDataProps<V> {
  const [options, setOptions] = React.useState<SelectOption<V>[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const fetchRef = React.useRef(fetchPage);
  const getOptionRef = React.useRef(getOption);
  const pageRef = React.useRef(0);
  const hasMoreRef = React.useRef(true);

  fetchRef.current = fetchPage;
  getOptionRef.current = getOption;

  const load = React.useCallback(
    async (q: string, page: number, signal: AbortSignal) => {
      const first = page === 0;

      if (first) setLoading(true);
      else setLoadingMore(true);

      try {
        const data = await fetchRef.current(q, page, signal);

        if (signal.aborted) return;
        const mapped = data.map(item => getOptionRef.current(item));

        setOptions(prev => (first ? mapped : [...prev, ...mapped]));
        hasMoreRef.current = data.length >= pageSize;
        pageRef.current = page;
      } catch {
        if (!signal.aborted && first) setOptions([]);
      } finally {
        if (!signal.aborted) {
          if (first) setLoading(false);
          else setLoadingMore(false);
        }
      }
    },
    [pageSize],
  );

  React.useEffect(() => {
    if (!open) return;
    pageRef.current = 0;
    hasMoreRef.current = true;

    const ctrl = new AbortController();
    const timer = setTimeout(
      () => load(query, 0, ctrl.signal),
      query ? debounce : 0,
    );

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [open, query, debounce, load]);

  const onScrollEnd = React.useCallback(() => {
    if (loading || loadingMore || !hasMoreRef.current) return;
    const ctrl = new AbortController();

    load(query, pageRef.current + 1, ctrl.signal);
  }, [loading, loadingMore, query, load]);

  return {
    options,
    loading,
    loadingMore,
    search: true,
    searchValue: query,
    onSearch: setQuery,
    onScrollEnd,
    onOpenChange: setOpen,
  };
}
