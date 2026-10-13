import type { TAgentReleaseSource } from "./tAgentReleaseSource.ts";

/**
 * Сборка в каталоге сборок.
 */
export interface IAgentReleaseArtifactDto {
  os: string;
  arch: string;
  file: string;
  sha256: string;
  signature?: string;
  source: TAgentReleaseSource;
  /** Путь от корня бэкенда. */
  url: string;
}
