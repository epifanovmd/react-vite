import type { TAgentArchivePlatform } from "./tAgentArchivePlatform.ts";

/**
 * Архив агента для узлов под платформу.
 */
export interface IAgentArchiveDto {
  platform: TAgentArchivePlatform;
  file: string;
  version?: string;
  size: number;
  /** В архиве есть compose.yml: запуск в Docker Compose. */
  compose: boolean;
}
