/**
 * Сборка воркера в выпуске.
 */
export interface IAgentWorkerArtifactDto {
  os: string;
  arch: string;
  file: string;
  sha256: string;
  signature?: string;
  name: string;
  version: string;
  /** Что запускать в сборке-архиве. */
  command?: string;
  stopTimeout?: string;
}
