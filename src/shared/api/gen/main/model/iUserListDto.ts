import type { PublicUserDto } from "./publicUserDto.ts";

export interface IUserListDto {
  count?: number;
  totalCount?: number;
  offset?: number;
  limit?: number;
  data: PublicUserDto[];
}
