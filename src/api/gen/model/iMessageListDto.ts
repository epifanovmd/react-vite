import type { MessageDto } from "./messageDto.ts";

export interface IMessageListDto {
  data: MessageDto[];
  hasMore: boolean;
  /** Present when using `around` — indicates newer messages exist above the window. */
  hasNewer?: boolean;
}
