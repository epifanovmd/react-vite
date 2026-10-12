/**
 * Способ установки по SSH: служба или агент без root (`run` занял бы сеанс SSH).
 */
export type TNodeSshInstallMode =
  (typeof TNodeSshInstallMode)[keyof typeof TNodeSshInstallMode];

export const TNodeSshInstallMode = {
  systemd: "systemd",
  rootless: "rootless",
} as const;
