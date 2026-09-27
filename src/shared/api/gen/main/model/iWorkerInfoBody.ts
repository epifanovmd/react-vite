import type { RecordStringString } from "./recordStringString.ts";

/**
 * Представление воркера.
 */
export interface IWorkerInfoBody {
  /** Имя экземпляра: хост и pid. */
  name: string;
  /** Сведения о воркере: версия SDK, устройство (строки). */
  meta?: RecordStringString;
}
