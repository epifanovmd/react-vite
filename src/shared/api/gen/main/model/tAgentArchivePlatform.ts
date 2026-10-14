export type TAgentArchivePlatform =
  (typeof TAgentArchivePlatform)[keyof typeof TAgentArchivePlatform];

export const TAgentArchivePlatform = {
  "linux-amd64": "linux-amd64",
  "linux-arm64": "linux-arm64",
  "darwin-amd64": "darwin-amd64",
  "darwin-arm64": "darwin-arm64",
} as const;
