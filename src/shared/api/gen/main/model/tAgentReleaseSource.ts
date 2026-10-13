/**
 * Откуда сборка: `local` — каталог сборок воркеров проекта.
 */
export type TAgentReleaseSource =
  (typeof TAgentReleaseSource)[keyof typeof TAgentReleaseSource];

export const TAgentReleaseSource = {
  local: "local",
} as const;
