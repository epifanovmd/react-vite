import type { EPrivacyLevel } from "./ePrivacyLevel.ts";

export type UpdatePrivacySettingsBody = {
  showAvatar?: EPrivacyLevel;
  showPhone?: EPrivacyLevel;
  showLastOnline?: EPrivacyLevel;
};
