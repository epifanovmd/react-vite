import type { TNodeSshInstallMode } from "./tNodeSshInstallMode.ts";

/**
 * Удаление агента по SSH; `mode: rootless` — агент без root удаляется без sudo.
 */
export interface IUninstallNodeAgentBody {
  /**
   * Способ установки по SSH: `systemd` (по умолчанию) — служба от root,
   * `rootless` — агент пользователя SSH без root (без sudo). Удаление агента без
   * root — тоже `rootless`.
   */
  mode?: TNodeSshInstallMode;
  /** Хост SSH; без него — `host` узла. */
  host?: string;
  /** Порт SSH (по умолчанию 22). */
  port?: number;
  /** Пользователь SSH (по умолчанию root). */
  username?: string;
  /** Пароль SSH (и для sudo, если он требует пароль). */
  password?: string;
  /** Приватный ключ SSH (PEM). */
  privateKey?: string;
  /** Пароль приватного ключа. */
  passphrase?: string;
  /**
   * Повышать права через sudo (по умолчанию — если пользователь не root);
   * агент без root (`mode: rootless`) ставится и удаляется без sudo.
   */
  sudo?: boolean;
  /**
   * Адрес сервера, доступный с узла: установщик и связь агента; без него —
   * `AGENT_PUBLIC_URL` / `APP_PUBLIC_URL`.
   */
  backendUrl?: string;
  /** Удалить и данные, конфигурацию, пакеты и пользователя службы. */
  purge?: boolean;
}
