import type { IAgentReleaseArtifactDto } from "./iAgentReleaseArtifactDto.ts";
import type { IAgentWorkerArtifactDto } from "./iAgentWorkerArtifactDto.ts";

/**
 * Сборки, которые раздаёт бэкенд: воркеры проекта — из `release/` каталога
 * архивов `AGENT_BUNDLE_DIR` (`manifest.json` от `agent pack --release-out`).
 */
export interface IAgentReleaseManifestDto {
  version: string;
  /** Ключ, которым подписаны сборки (base64). */
  publicKey?: string;
  artifacts: IAgentReleaseArtifactDto[];
  workers?: IAgentWorkerArtifactDto[];
}
