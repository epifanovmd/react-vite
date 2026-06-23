import type { MutableRefObject } from "react";

import type { SelectOption } from "../../types";

// Функция, выставляющая очередной набор опций в state.
// Оборачивается в useAsyncFetchCoordinator проверкой `signal.aborted`.
export type Apply<V extends string> = (next: SelectOption<V>[]) => void;

// Общий контекст для async fetch-effect хуков: снабжает их всеми ресурсами,
// которыми владеет useSelectOptions (state-сеттерами, ref'ами, doFetch'ем).
export interface AsyncFetchContext<V extends string> {
  /** true, если включён fetch-источник. Хуки-политики выходят при false. */
  enabled: boolean;
  /** Текущий query (актуален только при search). */
  query: string;
  /** Используется ли строка поиска — влияет на запрос first-fetch и query-refetch. */
  search: boolean;
  /** open-состояние селекта (для lazy/loadOnce-политик). */
  open: boolean;
  /** Debounce в мс для query-refetch. */
  debounce: number;

  /** Вызов fetch'а; сам управляет loading/abort. */
  doFetch: (q: string, signal: AbortSignal) => Promise<void>;

  /** Ref с последним запрошенным query — чтобы не повторять fetch для него же. */
  lastFetchedQueryRef: MutableRefObject<string | null>;
  /** Для lazyOpen: маркер «в этом «цикле открытия» уже стреляли». */
  lazyFetchedRef: MutableRefObject<boolean>;
  /** Для loadOnce: маркер «успешный fetch уже был; больше не грузить при open». */
  hasLoadedRef: MutableRefObject<boolean>;
}
