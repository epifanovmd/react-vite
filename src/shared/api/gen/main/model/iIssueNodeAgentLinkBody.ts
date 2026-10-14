import type { TAgentArchivePlatform } from "./tAgentArchivePlatform.ts";

export interface IIssueNodeAgentLinkBody {
  /** Имя агента; нет — прежнее имя агента узла или имя узла. */
  name?: string;
  /** Адрес сервера для агента; без него — `AGENT_PUBLIC_URL` / `APP_PUBLIC_URL`. */
  baseUrl?: string;
  /** Срок одноразового токена, минут (по умолчанию сутки). */
  expiresInMinutes?: number;
  /** Платформа: `linux-amd64`, `linux-arm64` (`install-options` — какие есть). */
  platform: TAgentArchivePlatform;
  /** Срок ссылки, минут (по умолчанию сутки); токен создаётся при скачивании. */
  linkExpiresInMinutes?: number;
}
