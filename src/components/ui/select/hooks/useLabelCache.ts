import * as React from "react";

import type { SelectOption, SelectValue } from "../types";

export const useLabelCache = <V extends SelectValue>() => {
  const cacheRef = React.useRef<Map<V, string>>(new Map());

  const updateCache = React.useCallback((opts: SelectOption<V>[]) => {
    opts.forEach(o => {
      cacheRef.current.set(o.value, o.label as string);
    });
  }, []);

  const seedCache = React.useCallback((opts: SelectOption<V>[]) => {
    opts.forEach(o => {
      if (!cacheRef.current.has(o.value)) {
        cacheRef.current.set(o.value, o.label as string);
      }
    });
  }, []);

  const getLabel = React.useCallback(
    (v: V): string => cacheRef.current.get(v) ?? String(v ?? ""),
    [],
  );

  return { updateCache, seedCache, getLabel };
};
