import type { IAgentArchiveDto } from "./iAgentArchiveDto.ts";

/**
 * Что можно выдать: адрес бэкенда для агентов и архивы по платформам.
 */
export interface IAgentInstallOptionsDto {
  server: string;
  archives: IAgentArchiveDto[];
}
