import type { ChatDto } from "./chatDto.ts";

export interface IChatListDto {
  count?: number;
  totalCount?: number;
  offset?: number;
  limit?: number;
  data: ChatDto[];
}
