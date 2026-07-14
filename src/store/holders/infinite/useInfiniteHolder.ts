import { IHolderError, InfiniteFetchFn } from "../Holder.types";
import { useHolderRef } from "../hooks/useHolderRef";
import { useWatchEffect, WatchOptions } from "../hooks/watchEffect";
import { InfiniteHolder } from "./InfiniteHolder";

// ─── Options ──────────────────────────────────────────────────────────────────

export interface UseInfiniteOptions<TItem, TArgs = void> {
  /** Функция загрузки порции данных. Аналог `queryFn` из TanStack Query. */
  queryFn?: InfiniteFetchFn<TItem, TArgs>;

  /** Элементов на "страницу" (default: 20). */
  pageSize?: number;

  /** Извлекатель ключа для CRUD-хелперов. */
  keyExtractor?: (item: TItem) => string | number;

  /**
   * Автоматически загружать первую порцию при монтировании
   * и перезагружать при изменении.
   *
   * @example
   * ```ts
   * watch: [{ userId }]   // load({ userId }) на mount + при смене userId
   * ```
   */
  watch?: TArgs extends void ? never : [TArgs];

  /**
   * Если `false` — запрос не выполняется.
   */
  enabled?: boolean;

  /** @deprecated Используйте `queryFn` */
  onFetch?: InfiniteFetchFn<TItem, TArgs>;
}

// ─── Result ───────────────────────────────────────────────────────────────────

/** Реактивные поля из InfiniteHolder (без методов). */
type InfiniteReactive<TItem, TArgs, TError extends IHolderError> = Pick<
  InfiniteHolder<TItem, TArgs, TError>,
  | "isLoading"
  | "isRefreshing"
  | "isBusy"
  | "isSuccess"
  | "isError"
  | "isIdle"
  | "error"
  | "items"
  | "isLoadingMore"
  | "isLoadMoreError"
  | "hasMore"
  | "loadMoreError"
>;

/** Методы InfiniteHolder (без holder). */
type InfiniteMethods<TItem, TArgs, TError extends IHolderError> = Pick<
  InfiniteHolder<TItem, TArgs, TError>,
  "load" | "refresh" | "loadMore" | "reset"
>;

export interface UseInfiniteResult<
  TItem,
  TArgs = void,
  TError extends IHolderError = IHolderError,
>
  extends
    InfiniteReactive<TItem, TArgs, TError>,
    InfiniteMethods<TItem, TArgs, TError> {
  /** Исходный холдер. */
  holder: InfiniteHolder<TItem, TArgs, TError>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * React-хук для работы с **бесконечной прокруткой / «Загрузить ещё»**.
 *
 * @example
 * ```tsx
 * const NotificationsList = observer(() => {
 *   const {
 *     items, isLoading, isLoadingMore, hasMore,
 *     load, loadMore,
 *   } = useInfinite<NotificationDto>({
 *     queryFn: ({ offset, limit }) => api.getNotifications({ offset, limit }),
 *     pageSize: 50,
 *   });
 *
 *   useEffect(() => { load(); }, []);
 *
 *   return (
 *     <InfiniteScroll
 *       data={items}
 *       onEndReached={loadMore}
 *       hasMore={hasMore}
 *       loader={isLoadingMore && <Spinner />}
 *     />
 *   );
 * });
 * ```
 */
export const useInfinite = <
  TItem,
  TArgs = void,
  TError extends IHolderError = IHolderError,
>(
  options?: UseInfiniteOptions<TItem, TArgs>,
): UseInfiniteResult<TItem, TArgs, TError> => {
  const holder = useHolderRef(() => {
    const fetchFn = (options?.queryFn ?? options?.onFetch) as
      InfiniteFetchFn<TItem, TArgs> | undefined;

    return new InfiniteHolder<TItem, TArgs, TError>({
      onFetch: fetchFn,
      pageSize: options?.pageSize,
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
    get isLoading() {
      return holder.isLoading;
    },
    get isRefreshing() {
      return holder.isRefreshing;
    },
    get isBusy() {
      return holder.isBusy;
    },
    get isLoadingMore() {
      return holder.isLoadingMore;
    },
    get isLoadMoreError() {
      return holder.isLoadMoreError;
    },
    get hasMore() {
      return holder.hasMore;
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
    get error() {
      return holder.error as TError | null;
    },
    get loadMoreError() {
      return holder.loadMoreError as TError | null;
    },

    load: holder.load.bind(holder),
    refresh: holder.refresh.bind(holder),
    loadMore: holder.loadMore.bind(holder) as InfiniteHolder<
      TItem,
      TArgs,
      TError
    >["loadMore"],
    reset: holder.reset.bind(holder),

    holder,
  };
};

/** @deprecated Используйте `useInfinite` */
export const useInfiniteHolder = useInfinite;
