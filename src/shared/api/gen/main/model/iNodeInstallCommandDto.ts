/**
 * Команда установки и одноразовый токен регистрации узла.
 */
export interface INodeInstallCommandDto {
  /** `curl …/api/v1/agent-bundle/install.sh | sudo sh -s -- --token …`. */
  command: string;
  /** Токен регистрации (одноразовый, с меткой узла) — только в этом ответе. */
  token: string;
  tokenId: string;
  expiresAt: string;
}
