import type { RecordStringString } from "./recordStringString.ts";

/**
 * Воркер очереди в статусе.
 */
export interface IWorkerInstanceDto {
  name: string;
  lastSeenAt: string;
  meta: RecordStringString;
}
