import { IHolderError, PagedFetchFn } from "../Holder.types";
import { useHolderRef } from "../hooks/useHolderRef";
import { useWatchEffect, WatchOptions } from "../hooks/watchEffect";
import { IPagedHolderPagination, PagedHolder } from "./PagedHolder";

// ─── Options ──────────────────────────────────────────────────────────────────

export interface UsePagedOptions<TItem, TArgs = void> {
  /** Функция загрузки страницы. Аналог `queryFn` из TanStack Query. */
  queryFn?: PagedFetchFn<TItem, TArgs>;

  /** Размер страницы по умолчанию. */
  pageSize?: number;

  /** Извлекатель ключа для CRUD-хелперов. */
  keyExtractor?: (item: TItem) => string | number;

  /**
   * Автоматически загружать первую страницу при монтировании
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
  onFetch?: PagedFetchFn<TItem, TArgs>;
}

// ─── Result ───────────────────────────────────────────────────────────────────

/** Реактивные поля из PagedHolder (без методов). */
type PagedReactive<TItem, TArgs, TError extends IHolderError> = Pick<
  PagedHolder<TItem, TArgs, TError>,
  | "isLoading"
  | "isRefreshing"
  | "isBusy"
  | "isSuccess"
  | "isError"
  | "isIdle"
  | "error"
  | "items"
  | "isEmpty"
  | "pagination"
  | "pageCount"
  | "hasNextPage"
  | "hasPrevPage"
>;

/** Методы PagedHolder (без holder). */
type PagedMethods<TItem, TArgs, TError extends IHolderError> = Pick<
  PagedHolder<TItem, TArgs, TError>,
  | "load"
  | "reload"
  | "goToPage"
  | "nextPage"
  | "prevPage"
  | "setPage"
  | "setPageSize"
  | "prependItem"
  | "appendItem"
  | "removeItem"
  | "updateItem"
  | "reset"
>;

export interface UsePagedResult<
  TItem,
  TArgs = void,
  TError extends IHolderError = IHolderError,
>
  extends
    PagedReactive<TItem, TArgs, TError>,
    PagedMethods<TItem, TArgs, TError> {
  /** Исходный холдер. */
  holder: PagedHolder<TItem, TArgs, TError>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * React-хук для работы с **серверной постраничной пагинацией**.
 *
 * @example
 * ```tsx
 * const OrdersTable = observer(() => {
 *   const [userId, setUserId] = useState('abc');
 *
 *   const {
 *     items, isLoading, isBusy, pagination,
 *     load, goToPage,
 *   } = usePaged<OrderDto, { userId: string }>({
 *     queryFn: ({ offset, limit }, { userId }) =>
 *       api.getOrdersByUser({ userId, offset, limit }),
 *     pageSize: 20,
 *     watch: [{ userId }],        // ← авто-загрузка + при смене userId
 *   });
 *
 *   return (
 *     <>
 *       <Table data={items} />
 *       <Pagination page={pagination.page} pageCount={pageCount} onChange={goToPage} />
 *     </>
 *   );
 * });
 * ```
 */
export const usePaged = <
  TItem,
  TArgs = void,
  TError extends IHolderError = IHolderError,
>(
  options?: UsePagedOptions<TItem, TArgs>,
): UsePagedResult<TItem, TArgs, TError> => {
  const holder = useHolderRef(() => {
    const fetchFn = (options?.queryFn ?? options?.onFetch) as
      PagedFetchFn<TItem, TArgs> | undefined;

    return new PagedHolder<TItem, TArgs, TError>({
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
    get pagination() {
      return holder.pagination;
    },
    get pageCount() {
      return holder.pageCount;
    },
    get hasNextPage() {
      return holder.hasNextPage;
    },
    get hasPrevPage() {
      return holder.hasPrevPage;
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
    reload: holder.reload.bind(holder),
    goToPage: holder.goToPage.bind(holder),
    nextPage: holder.nextPage.bind(holder),
    prevPage: holder.prevPage.bind(holder),
    setPage: holder.setPage.bind(holder),
    setPageSize: holder.setPageSize.bind(holder),
    prependItem: holder.prependItem.bind(holder),
    appendItem: holder.appendItem.bind(holder),
    removeItem: holder.removeItem.bind(holder),
    updateItem: holder.updateItem.bind(holder),
    reset: holder.reset.bind(holder),

    holder,
  };
};

/** @deprecated Используйте `usePaged` */
export const usePagedHolder = usePaged;
