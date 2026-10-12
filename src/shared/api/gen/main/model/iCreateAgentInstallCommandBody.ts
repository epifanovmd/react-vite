import type { AgentInstallMode } from "./agentInstallMode.ts";

/**
 * Команда установки агента на узел: архив папки агента с этого сервера и токен.
 */
export interface ICreateAgentInstallCommandBody {
  /** Токен регистрации; ровно одно из `token` и `tokenFile`. */
  token?: string;
  /** Путь к файлу с токеном на узле. */
  tokenFile?: string;
  /** Адрес сервера; без него — `AGENT_PUBLIC_URL` или `APP_PUBLIC_URL`. */
  baseUrl?: string;
  /**
   * Способ установки: `systemd` (по умолчанию) — служба от root, `rootless` —
   * агент пользователя без root, `run` — без установки, агент на переднем плане
   * (контейнер); `rootless` и `run` — команда без sudo.
   */
  mode?: AgentInstallMode;
}
