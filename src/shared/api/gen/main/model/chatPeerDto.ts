import type { EChatMemberRole } from "./eChatMemberRole.ts";
import type { PublicProfileDto } from "./publicProfileDto.ts";

/**
 * Публичные данные собеседника в direct-чате (без приватных настроек членства).
 */
export interface ChatPeerDto {
  userId: string;
  role: EChatMemberRole;
  profile?: PublicProfileDto;
}
