/**
 * Команда установки и одноразовый токен регистрации узла.
 */
export interface INodeInstallCommandDto {
  /** `curl …/agent/v1/bundle/install.sh | sudo sh -s -- --token …` (`rootless`, `run` — без sudo). */
  command: string;
  /** Токен регистрации (одноразовый, с меткой узла) — только в этом ответе. */
  token: string;
  tokenId: string;
  expiresAt: string;
}
