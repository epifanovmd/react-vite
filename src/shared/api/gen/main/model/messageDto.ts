import type { EMessageStatus } from "./eMessageStatus.ts";
import type { EMessageType } from "./eMessageType.ts";
import type { MessageAttachmentDto } from "./messageAttachmentDto.ts";
import type { MessageDtoMentionsItem } from "./messageDtoMentionsItem.ts";
import type { MessageDtoReactionsItem } from "./messageDtoReactionsItem.ts";
import type { MessageDtoSender } from "./messageDtoSender.ts";
import type { PollDto } from "./pollDto.ts";

export interface MessageDto {
  id: string;
  /** Транзитный клиентский ID для дедупликации оптимистичных сообщений. */
  localId?: string;
  chatId: string;
  /** @nullable */
  senderId: string | null;
  type: EMessageType;
  status: EMessageStatus;
  /** @nullable */
  content: string | null;
  /** @nullable */
  replyToId: string | null;
  /** @nullable */
  forwardedFromId: string | null;
  isEdited: boolean;
  isDeleted: boolean;
  isPinned: boolean;
  /** @nullable */
  pinnedAt: string | null;
  /** @nullable */
  pinnedById: string | null;
  keyboard: unknown | null;
  createdAt: string;
  updatedAt: string;
  sender?: MessageDtoSender;
  replyTo?: MessageDto | null;
  attachments: MessageAttachmentDto[];
  reactions: MessageDtoReactionsItem[];
  mentions: MessageDtoMentionsItem[];
  poll?: PollDto | null;
}
