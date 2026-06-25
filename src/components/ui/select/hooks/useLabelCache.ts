import * as React from "react";

import { SelectOption, SelectValue } from "../types";

export function useLabelCache<V extends SelectValue>() {
  const cacheRef = React.useRef<Partial<Record<string, React.ReactNode>>>({});

  const updateCache = React.useCallback((opts: SelectOption<V>[]) => {
    opts.forEach(o => {
      cacheRef.current[String(o.value)] = o.label;
    });
  }, []);

  const getLabel = React.useCallback(
    (v: V): React.ReactNode => cacheRef.current[String(v)] ?? v,
    [],
  );

  return { updateCache, getLabel };
}
