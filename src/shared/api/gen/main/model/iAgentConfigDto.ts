/**
 * Значение ключа настроек воркера.
 */
export interface IAgentConfigDto {
  agentId: string;
  worker: string;
  key: string;
  version: number;
  data: unknown;
  /** Время записи, мс. */
  updatedAt: number;
  /** Кто изменил. */
  actor?: string;
}
