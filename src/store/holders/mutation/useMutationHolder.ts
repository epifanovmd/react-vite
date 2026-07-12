import { useCallback, useRef } from "react";

import { IHolderError, MutationFn } from "../Holder.types";
import { IMutationHolderResult, MutationHolder } from "./MutationHolder";

// ─── Options ──────────────────────────────────────────────────────────────────

export interface UseMutationOptions<TArgs, TData, TError extends IHolderError = IHolderError> {
  /** Функция мутации. Аналог `mutationFn` из TanStack Query. */
  mutationFn?: MutationFn<TArgs, TData>;

  /** Колбэк при успехе. */
  onSuccess?: (data: TData) => void;

  /** Колбэк при ошибке. */
  onError?: (error: TError) => void;

  /** Колбэк в любом случае (успех или ошибка). */
  onSettled?: () => void;
}

// ─── Result ───────────────────────────────────────────────────────────────────

/** Реактивные поля из MutationHolder + isBusy. */
type MutationReactive<TArgs, TData, TError extends IHolderError> = Pick<
  MutationHolder<TArgs, TData, TError>,
  'data' | 'isLoading' | 'isSuccess' | 'isError' | 'isIdle' | 'error'
> & { isBusy: boolean };

export interface UseMutationResult<TArgs, TData, TError extends IHolderError = IHolderError>
  extends MutationReactive<TArgs, TData, TError> {
  /** Сбросить состояние в idle. */
  reset: () => void;

  /**
   * Запустить мутацию (fire-and-forget).
   * Возвращает данные при успехе или `undefined` при ошибке.
   * Результат также обрабатывается через `onSuccess`/`onError`.
   */
  mutate: TArgs extends void
    ? (args?: never) => Promise<TData | undefined>
    : (args: TArgs) => Promise<TData | undefined>;

  /**
   * Запустить мутацию (async).
   * Возвращает `Promise<TData>` — кидает ошибку при неудаче.
   */
  mutateAsync: TArgs extends void
    ? (args?: never) => Promise<TData>
    : (args: TArgs) => Promise<TData>;

  /** Исходный холдер. */
  holder: MutationHolder<TArgs, TData, TError>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * React-хук для **одной API-мутации** — create, update, delete.
 *
 * Аналог `useMutation` из TanStack Query, но на MobX-холдерах.
 *
 * @example
 * ```tsx
 * const CreateComment = observer(() => {
 *   const { isLoading, isBusy, mutate } = useMutation({
 *     mutationFn: (args: ICreateCommentDto) => api.createComment(postId, args),
 *     onSuccess: () => toast.success('Comment created!'),
 *   });
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(mutate)}>
 *       <AsyncButton isLoading={isBusy} type="submit">Create</AsyncButton>
 *     </form>
 *   );
 * });
 * ```
 *
 * @example с mutateAsync
 * ```tsx
 * const DeletePost = observer(() => {
 *   const { mutateAsync } = useMutation({
 *     mutationFn: (id: string) => api.deletePost(id),
 *   });
 *
 *   const handleDelete = async (id: string) => {
 *     try {
 *       await mutateAsync(id);
 *       navigate({ to: '/' });
 *     } catch (e) {
 *       toast.error('Failed to delete');
 *     }
 *   };
 * });
 * ```
 */
export const useMutation = <
  TArgs = void,
  TData = void,
  TError extends IHolderError = IHolderError,
>(
  options?: UseMutationOptions<TArgs, TData, TError>,
): UseMutationResult<TArgs, TData, TError> => {
  const ref = useRef<MutationHolder<TArgs, TData, TError> | null>(null);
  const callbacksRef = useRef(options);

  callbacksRef.current = options;

  if (!ref.current) {
    ref.current = new MutationHolder<TArgs, TData, TError>({
      onMutate: options?.mutationFn,
    });
  }

  const holder = ref.current;

  const executeWrapper = useCallback(
    async (...params: any[]): Promise<IMutationHolderResult<TData, TError>> => {
      return (holder.execute as (...args: any[]) => Promise<IMutationHolderResult<TData, TError>>)(...params);
    },
    [holder],
  );

  const mutate = useCallback(
    async (...params: any[]): Promise<TData | undefined> => {
      const result = await executeWrapper(...params);
      const callbacks = callbacksRef.current;

      if (result.data) {
        callbacks?.onSuccess?.(result.data);
      } else if (result.error) {
        callbacks?.onError?.(result.error as TError);
      }
      callbacks?.onSettled?.();

      return result.data ?? undefined;
    },
    [executeWrapper],
  ) as UseMutationResult<TArgs, TData, TError>["mutate"];

  const mutateAsync = useCallback(
    async (...params: any[]): Promise<TData> => {
      const result = await executeWrapper(...params);
      const callbacks = callbacksRef.current;

      if (result.error) {
        callbacks?.onError?.(result.error as TError);
        callbacks?.onSettled?.();
        throw result.error;
      }

      callbacks?.onSuccess?.(result.data!);
      callbacks?.onSettled?.();

      return result.data!;
    },
    [executeWrapper],
  ) as UseMutationResult<TArgs, TData, TError>["mutateAsync"];

  return {
    get data() { return holder.data; },
    get isLoading() { return holder.isLoading; },
    get isBusy() { return holder.isLoading; },
    get isSuccess() { return holder.isSuccess; },
    get isError() { return holder.isError; },
    get isIdle() { return holder.isIdle; },
    get error() { return holder.error as TError | null; },

    mutate,
    mutateAsync,
    reset: holder.reset.bind(holder),

    holder,
  };
}

/** @deprecated Используйте `useMutation` */
export const useMutationHolder = useMutation;
