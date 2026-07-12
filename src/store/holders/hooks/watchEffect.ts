import { useEffect } from "react";

// ─── Options ──────────────────────────────────────────────────────────────────

export interface WatchOptions<TArgs> {
  /**
   * Кортеж с аргументами запроса.
   *
   * - Вызывает `load(args)` при монтировании
   * - Перезапрашивает при изменении значения (сравнение по ===)
   *
   * @example
   * ```ts
   * watch: [postId]        // load(postId), перезапрос при смене postId
   * watch: [filters]       // load(filters), перезапрос при смене filters
   * ```
   */
  watch?: TArgs extends void ? never : [TArgs];

  /**
   * Если `false` — запрос не выполняется.
   * Полезно, когда нужны данные только при определённом условии:
   *
   * @example
   * ```ts
   * enabled: !!postId       // не грузить, пока postId пустой
   * enabled: isVisible      // не грузить, пока компонент скрыт
   * ```
   */
  enabled?: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

type AnyLoadFn = (...args: any[]) => unknown;

/**
 * Универсальный эффект для автоматической загрузки данных.
 *
 * - Вызывает `loadFn` с аргументами из `watch` на mount
 * - Перезапрашивает при изменении `watch[0]` или `enabled`
 * - Ничего не делает, если `watch` не передан
 */
export const useWatchEffect = <TArgs,>(
  loadFn: (...args: any[]) => unknown,
  options?: WatchOptions<TArgs>,
): void => {
  const { watch, enabled = true } = options ?? {};

  useEffect(() => {
    if (!enabled || watch === undefined) return;

    (loadFn as AnyLoadFn)(watch[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, watch !== undefined ? [watch[0], enabled] : []);
};
