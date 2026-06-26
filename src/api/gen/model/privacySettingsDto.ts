import type { EPrivacyLevel } from "./ePrivacyLevel.ts";

export interface PrivacySettingsDto {
  showLastOnline: EPrivacyLevel;
  showPhone: EPrivacyLevel;
  showAvatar: EPrivacyLevel;
}
