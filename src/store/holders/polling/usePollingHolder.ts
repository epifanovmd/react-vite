import { useEffect } from "react";

import { EntityFetchFn, IHolderError } from "../Holder.types";
import { useHolderRef } from "../hooks/useHolderRef";
import { PollingHolder, PollingStartOptions } from "./PollingHolder";

// ─── Options ──────────────────────────────────────────────────────────────────

export interface UsePollingOptions<TData, TArgs = void> {
  /** Функция загрузки данных для опроса. */
  queryFn?: EntityFetchFn<TData, TArgs>;

  /** Интервал опроса по умолчанию в мс (default: 5000). */
  interval?: number;

  /** Начальные данные. */
  initialData?: TData;

  /**
   * Автоматически запустить опрос при монтировании.
   *
   * - `true` → `startPolling()` на mount (TArgs = void)
   * - Любое значение TArgs → `startPolling({ args: value })` на mount
   *
   * Автоматически останавливается при unmount.
   *
   * @example
   * ```ts
   * autoStart: true          // TArgs = void
   * autoStart: jobId         // TArgs = string
   * ```
   */
  autoStart?: TArgs extends void ? true : TArgs;

  /** @deprecated Используйте `queryFn` */
  onFetch?: EntityFetchFn<TData, TArgs>;
}

// ─── Result ───────────────────────────────────────────────────────────────────

/** Реактивные поля из PollingHolder (без методов). */
type PollingReactive<TData, TArgs, TError extends IHolderError> = Pick<
  PollingHolder<TData, TArgs, TError>,
  'data' | 'isLoading' | 'isBusy' | 'isPolling'
  | 'isSuccess' | 'isError' | 'error'
>;

/** Методы PollingHolder (без holder). */
type PollingMethods<TData, TArgs, TError extends IHolderError> = Pick<
  PollingHolder<TData, TArgs, TError>,
  'load' | 'refresh' | 'reset'
>;

export interface UsePollingResult<TData, TArgs = void, TError extends IHolderError = IHolderError>
  extends PollingReactive<TData, TArgs, TError>,
    PollingMethods<TData, TArgs, TError> {
  /** Запустить опрос. Можно передать args и/или интервал. */
  start: (options?: PollingStartOptions<TArgs>) => void;
  /** Остановить опрос. */
  stop: () => void;

  /** Исходный холдер. */
  holder: PollingHolder<TData, TArgs, TError>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * React-хук для работы с **автоматическим опросом** (polling).
 *
 * @example
 * ```tsx
 * const JobStatus = observer(() => {
 *   const { data, isPolling, isBusy, stop, start } = usePolling({
 *     queryFn: () => api.getJobStatus(jobId),
 *     interval: 5_000,
 *     autoStart: true,
 *   });
 *
 *   return (
 *     <div>
 *       <StatusDot active={isPolling} />
 *       <pre>{JSON.stringify(data, null, 2)}</pre>
 *       <button onClick={stop}>Stop</button>
 *     </div>
 *   );
 * });
 * ```
 */
export const usePolling = <
  TData,
  TArgs = void,
  TError extends IHolderError = IHolderError,
>(
  options?: UsePollingOptions<TData, TArgs>,
): UsePollingResult<TData, TArgs, TError> => {
  const holder = useHolderRef(() => {
    const fetchFn = (options?.queryFn ?? options?.onFetch) as
      | EntityFetchFn<TData, TArgs>
      | undefined;

    return new PollingHolder<TData, TArgs, TError>({
      onFetch: fetchFn,
      interval: options?.interval,
      initialData: options?.initialData,
    });
  });

  useEffect(() => {
    const { autoStart } = options ?? {};

    if (autoStart === true) {
      holder.startPolling();
    } else if (autoStart !== undefined) {
      holder.startPolling({ args: autoStart } as PollingStartOptions<TArgs>);
    }

    return () => {
      holder.stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    get data() { return holder.data; },
    get isLoading() { return holder.isLoading; },
    get isBusy() { return holder.isBusy; },
    get isPolling() { return holder.isPolling; },
    get isSuccess() { return holder.isSuccess; },
    get isError() { return holder.isError; },
    get error() { return holder.error as TError | null; },

    start: ((...args: any[]) => (holder.startPolling as any)(...args)) as (options?: PollingStartOptions<TArgs>) => void,
    stop: holder.stopPolling.bind(holder),
    load: holder.load.bind(holder),
    refresh: holder.refresh.bind(holder),
    reset: holder.reset.bind(holder),

    holder,
  };
}

/** @deprecated Используйте `usePolling` */
export const usePollingHolder = usePolling;
