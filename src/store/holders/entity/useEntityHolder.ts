import { EntityFetchFn, IHolderError } from "../Holder.types";
import { useHolderRef } from "../hooks/useHolderRef";
import { useWatchEffect, WatchOptions } from "../hooks/watchEffect";
import { EntityHolder } from "./EntityHolder";

// ─── Options ──────────────────────────────────────────────────────────────────

export interface UseEntityOptions<TData, TArgs = void> {
  /**
   * Функция загрузки данных.
   * Аналог `queryFn` из TanStack Query.
   *
   * @example
   * ```ts
   * queryFn: () => api.getMyUser()
   * queryFn: (id) => api.getPost(id)
   * ```
   */
  queryFn?: EntityFetchFn<TData, TArgs>;

  /** Начальные данные (статус сразу станет Success). */
  initialData?: TData;

  /**
   * Автоматически загружать при монтировании и перезагружать при изменении.
   *
   * Кортеж `[args]`, где:
   * - `args` — аргумент, передаваемый в `load(args)`
   * - При изменении `args` (сравнение через ===) — автоматический перезапрос
   *
   * @example
   * ```ts
   * watch: [postId]        // load(postId) на mount + при смене postId
   * watch: [filters]       // load(filters) на mount + при смене filters
   * ```
   */
  watch?: TArgs extends void ? never : [TArgs];

  /**
   * Если `false` — запрос не выполняется.
   * Полезно для отложенной загрузки.
   *
   * @example
   * ```ts
   * enabled: !!postId       // не грузить, пока нет ID
   * ```
   */
  enabled?: boolean;

  /** @deprecated Используйте `queryFn` */
  onFetch?: EntityFetchFn<TData, TArgs>;
}

// ─── Result ───────────────────────────────────────────────────────────────────

/** Реактивные поля из EntityHolder (без методов). */
type EntityReactive<TData, TArgs, TError extends IHolderError> = Pick<
  EntityHolder<TData, TArgs, TError>,
  | "data"
  | "isLoading"
  | "isRefreshing"
  | "isBusy"
  | "isSuccess"
  | "isError"
  | "isIdle"
  | "isEmpty"
  | "isFilled"
  | "isReady"
  | "error"
>;

/** Методы EntityHolder (без holder). */
type EntityMethods<TData, TArgs, TError extends IHolderError> = Pick<
  EntityHolder<TData, TArgs, TError>,
  "load" | "refresh" | "fromApi" | "setData" | "reset"
>;

export interface UseEntityResult<
  TData,
  TArgs = void,
  TError extends IHolderError = IHolderError,
>
  extends
    EntityReactive<TData, TArgs, TError>,
    EntityMethods<TData, TArgs, TError> {
  /** Исходный холдер (для низкоуровневого доступа). */
  holder: EntityHolder<TData, TArgs, TError>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * React-хук для работы с **одной сущностью**.
 *
 * Аналог `useQuery` из TanStack Query, но на MobX-холдерах.
 *
 * @example
 * ```tsx
 * const Profile = observer(() => {
 *   const { data: user, isLoading } = useEntity({
 *     queryFn: () => api.getMyUser(),
 *   });
 *
 *   useEffect(() => { user.load(); }, []);
 *
 *   if (isLoading) return <Spinner />;
 *   return <ProfileCard user={user!} />;
 * });
 * ```
 *
 * @example с watch
 * ```tsx
 * const PostPage = observer(({ postId }: { postId: string }) => {
 *   const { data: post, isBusy } = useEntity({
 *     queryFn: (id: string) => api.getPost(id),
 *     watch: [postId],
 *   });
 *
 *   return <PostView data={post} loading={isBusy} />;
 * });
 * ```
 *
 * @example с фильтрами и enabled
 * ```tsx
 * const [filters, setFilters] = useState({ search: '', status: '' });
 *
 * const { data } = useEntity({
 *   queryFn: (f: Filters) => api.search(f),
 *   watch: [filters],
 *   enabled: filters.search.length >= 3,
 * });
 * ```
 */
export const useEntity = <
  TData,
  TArgs = void,
  TError extends IHolderError = IHolderError,
>(
  options?: UseEntityOptions<TData, TArgs>,
): UseEntityResult<TData, TArgs, TError> => {
  const holder = useHolderRef(() => {
    const fetchFn = (options?.queryFn ?? options?.onFetch) as
      EntityFetchFn<TData, TArgs> | undefined;

    return new EntityHolder<TData, TArgs, TError>({
      onFetch: fetchFn,
      initialData: options?.initialData,
    });
  });

  useWatchEffect(holder.load.bind(holder) as (...args: any[]) => unknown, {
    watch: options?.watch as WatchOptions<TArgs>["watch"],
    enabled: options?.enabled,
  });

  return {
    get data() {
      return holder.data;
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
    get isFilled() {
      return holder.isFilled;
    },
    get isReady() {
      return holder.isReady;
    },
    get error() {
      return holder.error;
    },

    load: holder.load.bind(holder),
    refresh: holder.refresh.bind(holder),
    fromApi: holder.fromApi.bind(holder) as EntityHolder<
      TData,
      TArgs,
      TError
    >["fromApi"],
    setData: holder.setData.bind(holder),
    reset: holder.reset.bind(holder),

    holder,
  };
};

/** @deprecated Используйте `useEntity` */
export const useEntityHolder = useEntity;
