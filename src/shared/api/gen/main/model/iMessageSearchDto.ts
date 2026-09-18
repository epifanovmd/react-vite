import type { MessageDto } from "./messageDto.ts";

export interface IMessageSearchDto {
  data: MessageDto[];
  totalCount: number;
}
