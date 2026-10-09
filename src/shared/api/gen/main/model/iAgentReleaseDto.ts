import type { IAgentReleaseManifestDto } from "./iAgentReleaseManifestDto.ts";
import type { IAgentUpdateCandidateDto } from "./iAgentUpdateCandidateDto.ts";
import type { IAgentWorkerUpdateCandidateDto } from "./iAgentWorkerUpdateCandidateDto.ts";

/**
 * Сборки агента и кого можно обновить.
 */
export interface IAgentReleaseDto {
  /** `null` — нет ни источника сборок агента, ни каталога сборок воркеров. */
  manifest: IAgentReleaseManifestDto | null;
  candidates: IAgentUpdateCandidateDto[];
  workerCandidates: IAgentWorkerUpdateCandidateDto[];
}
