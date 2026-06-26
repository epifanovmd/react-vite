import type { IFileDto } from "./iFileDto.ts";
import type { UserDto } from "./userDto.ts";

export interface ProfileDto {
  id: string;
  userId: string;
  /** @nullable */
  firstName: string | null;
  /** @nullable */
  lastName: string | null;
  /** @nullable */
  birthDate: string | null;
  /** @nullable */
  gender: string | null;
  /** @nullable */
  lastOnline: string | null;
  createdAt: string;
  updatedAt: string;
  avatar?: IFileDto;
  user?: UserDto;
}
