import type { FetchPolicyKind } from "./fetchPolicy";
import type { AsyncFetchContext } from "./types";
import { useLazyOpenFetch } from "./useLazyOpenFetch";
import { useLoadOnceFetch } from "./useLoadOnceFetch";
import { useMountFetch } from "./useMountFetch";
import { useQueryRefetch } from "./useQueryRefetch";

export interface UseAsyncFetchCoordinatorInput<V extends string>
  extends Omit<AsyncFetchContext<V>, "enabled"> {
  policy: FetchPolicyKind;
}

/**
 * Координатор async-политик: вызывает все 4 эффект-хука, делегируя каждому
 * свою часть через `enabled`-флаг.
 *
 * OCP: добавление новой политики = новый use*Fetch-хук + ветка в `pickFetchPolicy`
 * + вызов здесь. Остальные хуки и сам useSelectOptions не трогаются.
 * SRP: каждый хук отвечает за одну политику; координатор только комбинирует.
 */
export const useAsyncFetchCoordinator = <V extends string>({
  policy,
  ...ctx
}: UseAsyncFetchCoordinatorInput<V>): void => {
  useMountFetch<V>({ ...ctx, enabled: policy === "mount" });
  useLazyOpenFetch<V>({ ...ctx, enabled: policy === "lazyOpen" });
  useLoadOnceFetch<V>({ ...ctx, enabled: policy === "loadOnce" });
  // query-refetch активен при любом async-режиме.
  useQueryRefetch<V>({ ...ctx, enabled: policy !== "never" });
};
