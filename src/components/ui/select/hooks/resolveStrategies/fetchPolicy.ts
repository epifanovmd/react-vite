// Политика fetch'а для async-источника. Определяет, когда делать первый запрос:
//   - mount     — при монтировании (eager).
//   - lazyOpen  — при каждом открытии попапа (default).
//   - loadOnce  — при первом открытии, дальше держим закешированные опции.
//   - never     — fetch не используется (sync-источник или его отсутствие).
// Query-re-fetch (debounced) — ортогональный и работает для всех политик кроме never.
export type FetchPolicyKind = "mount" | "lazyOpen" | "loadOnce" | "never";

export interface PickPolicyInput {
  isAsync: boolean;
  fetchOnMount: boolean;
  loadOnce: boolean;
}

export const pickFetchPolicy = ({
  isAsync,
  fetchOnMount,
  loadOnce,
}: PickPolicyInput): FetchPolicyKind => {
  if (!isAsync) return "never";
  if (fetchOnMount) return "mount";
  if (loadOnce) return "loadOnce";

  return "lazyOpen";
};
