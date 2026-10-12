/**
 * Способ установки агента на узел: `systemd` — служба от root (`agent install`),
 * `rootless` — агент пользователя без root (`--rootless`, команда без sudo),
 * `run` — без установки: агент на переднем плане (`--run`, контейнер, свой
 * менеджер процессов; команда без sudo).
 */
export type AgentInstallMode =
  (typeof AgentInstallMode)[keyof typeof AgentInstallMode];

export const AgentInstallMode = {
  systemd: "systemd",
  rootless: "rootless",
  run: "run",
} as const;
