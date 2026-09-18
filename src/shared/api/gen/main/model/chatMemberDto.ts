import type { EChatMemberRole } from "./eChatMemberRole.ts";
import type { PublicProfileDto } from "./publicProfileDto.ts";

export interface ChatMemberDto {
  id: string;
  userId: string;
  role: EChatMemberRole;
  joinedAt: string;
  /** @nullable */
  mutedUntil: string | null;
  /** @nullable */
  lastReadMessageId: string | null;
  isPinnedChat: boolean;
  /** @nullable */
  pinnedChatAt: string | null;
  /** @nullable */
  folderId: string | null;
  profile?: PublicProfileDto;
}
