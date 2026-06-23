import * as React from "react";

import type { AsyncFetchContext } from "./types";

/**
 * Политика `lazyOpen`: fetch при каждом открытии.
 * Флаг lazyFetchedRef защищает от двойного fetch'а в одном «цикле открытия»,
 * но сбрасывается в cleanup, чтобы StrictMode двойной invoke продолжал работать,
 * а следующее открытие повторно запросило данные.
 */
export const useLazyOpenFetch = <V extends string>({
  enabled,
  open,
  search,
  query,
  doFetch,
  lastFetchedQueryRef,
  lazyFetchedRef,
}: AsyncFetchContext<V>): void => {
  React.useEffect(() => {
    if (!enabled || !open || lazyFetchedRef.current) return;
    lazyFetchedRef.current = true;
    const ctrl = new AbortController();
    const q = search ? query : "";

    lastFetchedQueryRef.current = q;
    doFetch(q, ctrl.signal);

    return () => {
      lazyFetchedRef.current = false;
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, open]);
};
