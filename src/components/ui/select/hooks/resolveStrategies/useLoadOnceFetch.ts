import * as React from "react";

import type { AsyncFetchContext } from "./types";

/**
 * Политика `loadOnce`: fetch при первом открытии, далее опции держатся.
 * hasLoadedRef взводится только после успешного ответа (внутри doFetch),
 * поэтому StrictMode'овый abort+cleanup на первой инвокации не «выедает» лимит
 * — вторая инвокация корректно стрельнёт первый настоящий fetch.
 */
export const useLoadOnceFetch = <V extends string>({
  enabled,
  open,
  search,
  query,
  doFetch,
  lastFetchedQueryRef,
  hasLoadedRef,
}: AsyncFetchContext<V>): void => {
  React.useEffect(() => {
    if (!enabled || !open || hasLoadedRef.current) return;
    const ctrl = new AbortController();
    const q = search ? query : "";

    lastFetchedQueryRef.current = q;
    doFetch(q, ctrl.signal);

    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, open]);
};
