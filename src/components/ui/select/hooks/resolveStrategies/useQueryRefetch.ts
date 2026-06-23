import * as React from "react";

import type { AsyncFetchContext } from "./types";

/**
 * Ортогональная политика: debounced re-fetch при смене query.
 * Активна для любой основной политики кроме `never`, требует search=true и open=true.
 * Пропускает повторы для того же query, чтобы не ломать кеш lastFetched.
 */
export const useQueryRefetch = <V extends string>({
  enabled,
  open,
  search,
  query,
  debounce,
  doFetch,
  lastFetchedQueryRef,
}: AsyncFetchContext<V>): void => {
  React.useEffect(() => {
    if (!enabled || !search || !open) return;
    if (lastFetchedQueryRef.current === query) return;

    const ctrl = new AbortController();
    const timer = setTimeout(() => {
      lastFetchedQueryRef.current = query;
      doFetch(query, ctrl.signal);
    }, debounce);

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, enabled, search, open, debounce]);
};
