import type { EContactStatus } from "./eContactStatus.ts";
import type { PublicProfileDto } from "./publicProfileDto.ts";

export interface ContactDto {
  id: string;
  userId: string;
  contactUserId: string;
  /** @nullable */
  displayName: string | null;
  status: EContactStatus;
  createdAt: string;
  updatedAt: string;
  contactProfile?: PublicProfileDto;
}
