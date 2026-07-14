import { CollectionFetchFn, IHolderError } from "../Holder.types";
import { useHolderRef } from "../hooks/useHolderRef";
import { useWatchEffect, WatchOptions } from "../hooks/watchEffect";
import { CollectionHolder } from "./CollectionHolder";

// ─── Options ──────────────────────────────────────────────────────────────────

export interface UseCollectionOptions<TItem, TArgs = void> {
  /** Функция загрузки списка. Аналог `queryFn` из TanStack Query. */
  queryFn?: CollectionFetchFn<TItem, TArgs>;

  /** Извлекатель ключа для CRUD-хелперов (updateItem / removeItem). */
  keyExtractor?: (item: TItem) => string | number;

  /**
   * Автоматически загружать при монтировании и перезагружать при изменении.
   *
   * @example
   * ```ts
   * watch: [filters]  // load(filters) на mount + при смене filters
   * ```
   */
  watch?: TArgs extends void ? never : [TArgs];

  /**
   * Если `false` — запрос не выполняется.
   *
   * @example
   * ```ts
   * enabled: isOpen
   * ```
   */
  enabled?: boolean;

  /** @deprecated Используйте `queryFn` */
  onFetch?: CollectionFetchFn<TItem, TArgs>;
}

// ─── Result ───────────────────────────────────────────────────────────────────

/** Реактивные поля из CollectionHolder (без методов). */
type CollectionReactive<TItem, TArgs, TError extends IHolderError> = Pick<
  CollectionHolder<TItem, TArgs, TError>,
  | "isLoading"
  | "isRefreshing"
  | "isBusy"
  | "isSuccess"
  | "isError"
  | "isIdle"
  | "error"
  | "items"
  | "isEmpty"
  | "count"
>;

/** Методы CollectionHolder (без holder). */
type CollectionMethods<TItem, TArgs, TError extends IHolderError> = Pick<
  CollectionHolder<TItem, TArgs, TError>,
  | "load"
  | "refresh"
  | "fromApi"
  | "setItems"
  | "prependItem"
  | "appendItem"
  | "removeItem"
  | "updateItem"
  | "upsertItem"
  | "reset"
>;

export interface UseCollectionResult<
  TItem,
  TArgs = void,
  TError extends IHolderError = IHolderError,
>
  extends
    CollectionReactive<TItem, TArgs, TError>,
    CollectionMethods<TItem, TArgs, TError> {
  /** Исходный холдер. */
  holder: CollectionHolder<TItem, TArgs, TError>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * React-хук для работы с **плоским списком** без серверной пагинации.
 *
 * @example
 * ```tsx
 * const CategorySelect = observer(() => {
 *   const { items: categories, isLoading } = useCollection({
 *     queryFn: () => api.getCategories(),
 *     watch: [filters],   // ← авто-загрузка + перезапрос при смене фильтров
 *   });
 *
 *   return categories.map(cat => <Option key={cat.id} value={cat.id} />);
 * });
 * ```
 */
export const useCollection = <
  TItem,
  TArgs = void,
  TError extends IHolderError = IHolderError,
>(
  options?: UseCollectionOptions<TItem, TArgs>,
): UseCollectionResult<TItem, TArgs, TError> => {
  const holder = useHolderRef(() => {
    const fetchFn = (options?.queryFn ?? options?.onFetch) as
      CollectionFetchFn<TItem, TArgs> | undefined;

    return new CollectionHolder<TItem, TArgs, TError>({
      onFetch: fetchFn,
      keyExtractor: options?.keyExtractor,
    });
  });

  useWatchEffect(holder.load.bind(holder) as (...args: any[]) => unknown, {
    watch: options?.watch as WatchOptions<TArgs>["watch"],
    enabled: options?.enabled,
  });

  return {
    get items() {
      return holder.items;
    },
    get count() {
      return holder.count;
    },
    get isLoading() {
      return holder.isLoading;
    },
    get isRefreshing() {
      return holder.isRefreshing;
    },
    get isBusy() {
      return holder.isBusy;
    },
    get isSuccess() {
      return holder.isSuccess;
    },
    get isError() {
      return holder.isError;
    },
    get isIdle() {
      return holder.isIdle;
    },
    get isEmpty() {
      return holder.isEmpty;
    },
    get error() {
      return holder.error as TError | null;
    },

    load: holder.load.bind(holder),
    refresh: holder.refresh.bind(holder),
    fromApi: holder.fromApi.bind(holder) as CollectionHolder<
      TItem,
      TArgs,
      TError
    >["fromApi"],
    setItems: holder.setItems.bind(holder),
    prependItem: holder.prependItem.bind(holder),
    appendItem: holder.appendItem.bind(holder),
    removeItem: holder.removeItem.bind(holder),
    updateItem: holder.updateItem.bind(holder),
    upsertItem: holder.upsertItem.bind(holder),
    reset: holder.reset.bind(holder),

    holder,
  };
};

/** @deprecated Используйте `useCollection` */
export const useCollectionHolder = useCollection;
