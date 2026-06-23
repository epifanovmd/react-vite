import * as React from "react";

import type { AsyncFetchContext } from "./types";

/**
 * Политика `mount`: один eager-fetch при монтировании.
 * Пустой deps (mount-only) — StrictMode двойной invoke приведёт к двум запросам,
 * но второй abort'ит первый, так что на UI попадает один корректный результат.
 */
export const useMountFetch = <V extends string>({
  enabled,
  search,
  query,
  doFetch,
  lastFetchedQueryRef,
}: AsyncFetchContext<V>): void => {
  React.useEffect(() => {
    if (!enabled) return;
    const ctrl = new AbortController();
    const q = search ? query : "";

    lastFetchedQueryRef.current = q;
    doFetch(q, ctrl.signal);

    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
