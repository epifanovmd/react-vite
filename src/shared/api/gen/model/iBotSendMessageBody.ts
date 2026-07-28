import type { EMessageType } from "./eMessageType.ts";

export interface IBotSendMessageBody {
  chatId: string;
  content?: string;
  type?: EMessageType;
  replyToId?: string;
  fileIds?: string[];
}
