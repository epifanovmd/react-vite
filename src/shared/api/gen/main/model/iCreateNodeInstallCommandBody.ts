import type { AgentInstallMode } from "./agentInstallMode.ts";

/**
 * Команда установки агента на узел вручную.
 */
export interface ICreateNodeInstallCommandBody {
  /**
   * Способ установки: `systemd` (по умолчанию) — служба от root, `rootless` —
   * агент пользователя без root, `run` — без установки, агент на переднем плане,
   * `docker` — Docker Compose из архива агента; кроме `systemd` — команда без sudo.
   */
  mode?: AgentInstallMode;
  /** Адрес сервера для агента; без него — `AGENT_PUBLIC_URL` / `APP_PUBLIC_URL`. */
  baseUrl?: string;
  /** Срок одноразового токена, минут (по умолчанию сутки). */
  expiresInMinutes?: number;
}
