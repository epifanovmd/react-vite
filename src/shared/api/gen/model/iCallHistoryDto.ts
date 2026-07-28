import type { CallDto } from "./callDto.ts";

export interface ICallHistoryDto {
  data: CallDto[];
  totalCount: number;
}
