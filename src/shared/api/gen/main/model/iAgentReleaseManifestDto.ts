import type { IAgentReleaseArtifactDto } from "./iAgentReleaseArtifactDto.ts";
import type { IAgentReleaseRemoteDto } from "./iAgentReleaseRemoteDto.ts";
import type { IAgentWorkerArtifactDto } from "./iAgentWorkerArtifactDto.ts";

/**
 * Сборки, которые раздаёт бэкенд: агент и netprobe — из источника сборок
 * агента, воркеры проекта — из `AGENT_RELEASES_DIR`.
 */
export interface IAgentReleaseManifestDto {
  version: string;
  /** Ключ, которым подписаны сборки (base64). */
  publicKey?: string;
  artifacts: IAgentReleaseArtifactDto[];
  workers?: IAgentWorkerArtifactDto[];
  /** Нет — источник сборок агента не задан или ещё не ответил. */
  remote?: IAgentReleaseRemoteDto;
}
