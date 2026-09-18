import type { PublicProfileDto } from "./publicProfileDto.ts";

export interface PublicUserDto {
  userId: string;
  /** @nullable */
  email: string | null;
  /** @nullable */
  username: string | null;
  profile?: PublicProfileDto;
}
