import type { PublicProfileDto } from "./publicProfileDto.ts";

export interface IProfileListDto {
  count?: number;
  totalCount?: number;
  offset?: number;
  limit?: number;
  data: PublicProfileDto[];
}
