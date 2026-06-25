import type { MutableRefObject } from "react";

import type { SelectOption } from "../../types";

export type Apply<V extends string> = (next: SelectOption<V>[]) => void;

export interface AsyncFetchContext<V extends string> {
  enabled: boolean;
  query: string;
  search: boolean;
  open: boolean;
  debounce: number;

  doFetch: (q: string, signal: AbortSignal) => Promise<void>;
  lastFetchedQueryRef: MutableRefObject<string | null>;
  lazyFetchedRef: MutableRefObject<boolean>;
  hasLoadedRef: MutableRefObject<boolean>;
}
