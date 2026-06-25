import * as React from "react";

import { SelectOption } from "../types";
import {
  pickFetchPolicy,
  pickSource,
  resolveSource,
  useAsyncFetchCoordinator,
} from "./resolveStrategies";

export interface UseSelectOptionsProps<TData, V extends string> {
  options?: SelectOption<V>[] | ((query: string) => SelectOption<V>[]);
  fetchOptions?: (query: string, signal?: AbortSignal) => Promise<TData[]>;
  getOption?: (item: TData) => SelectOption<V>;
  fetchOnMount?: boolean;
  loadOnce?: boolean;
  debounce?: number;
  search?: boolean;
  query: string;
  open: boolean;
}

export interface UseSelectOptionsResult<V extends string> {
  options: SelectOption<V>[];
  loading: boolean;
}

export function useSelectOptions<TData = unknown, V extends string = string>({
  options: optionsProp,
  fetchOptions,
  getOption,
  fetchOnMount = false,
  loadOnce = false,
  debounce = 300,
  search = false,
  query,
  open,
}: UseSelectOptionsProps<TData, V>): UseSelectOptionsResult<V> {
  const [asyncOptions, setAsyncOptions] = React.useState<SelectOption<V>[]>([]);
  const [loading, setLoading] = React.useState(false);

  const lastFetchedQueryRef = React.useRef<string | null>(null);
  const lazyFetchedRef = React.useRef(false);
  const hasLoadedRef = React.useRef(false);

  const fetchRef = React.useRef(fetchOptions);
  const getOptionRef = React.useRef(getOption);

  fetchRef.current = fetchOptions;
  getOptionRef.current = getOption;

  const isAsync = !!fetchOptions;
  const source = React.useMemo(() => pickSource<V>(optionsProp), [optionsProp]);

  const doFetch = React.useCallback(async (q: string, signal: AbortSignal) => {
    if (!fetchRef.current || !getOptionRef.current) return;
    setLoading(true);
    try {
      const data = await fetchRef.current(q, signal);

      if (!signal.aborted) {
        setAsyncOptions(data.map(item => getOptionRef.current!(item)));
        hasLoadedRef.current = true;
      }
    } catch {
      if (!signal.aborted) setAsyncOptions([]);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  const policy = pickFetchPolicy({ isAsync, fetchOnMount, loadOnce });

  useAsyncFetchCoordinator<V>({
    policy,
    query,
    search,
    open,
    debounce,
    doFetch,
    lastFetchedQueryRef,
    lazyFetchedRef,
    hasLoadedRef,
  });

  const computedOptions = React.useMemo(
    () => resolveSource<V>(source, query, search),
    [source, query, search],
  );

  return {
    options: isAsync ? asyncOptions : computedOptions,
    loading: isAsync ? loading : false,
  };
}
