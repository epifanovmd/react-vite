import type { IAgentManifestConfigDto } from "./iAgentManifestConfigDto.ts";
import type { IAgentManifestEventDto } from "./iAgentManifestEventDto.ts";
import type { IAgentManifestJobDto } from "./iAgentManifestJobDto.ts";
import type { IAgentManifestRouteDto } from "./iAgentManifestRouteDto.ts";

/**
 * Манифест воркера — ответ `GET /manifest`: что воркер умеет.
 */
export interface IAgentWorkerManifestDto {
  version: string;
  description?: string;
  configs: IAgentManifestConfigDto[];
  routes: IAgentManifestRouteDto[];
  events: IAgentManifestEventDto[];
  jobs: IAgentManifestJobDto[];
}
