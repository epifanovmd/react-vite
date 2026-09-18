import type { MediaItemDtoSender } from "./mediaItemDtoSender.ts";
import type { MessageAttachmentDto } from "./messageAttachmentDto.ts";

export interface MediaItemDto {
  id: string;
  messageId: string;
  chatId: string;
  /** @nullable */
  senderId: string | null;
  attachments: MessageAttachmentDto[];
  createdAt: string;
  sender?: MediaItemDtoSender;
}
