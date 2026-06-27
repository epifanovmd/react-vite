import { PublicProfileDto } from "@api/gen/model";

export interface SocketUserUsernameChangedPayload {
  userId: string;
  username: string | null;
}

export interface SocketUserEmailVerifiedPayload {
  verified: boolean;
}

export interface SocketUserPrivilegesChangedPayload {
  roles: string[];
  permissions: string[];
}

export interface SocketUserPresencePayload {
  userId: string;
  lastOnline?: string | null;
}

export interface SocketPresenceInitPayload {
  onlineUserIds: string[];
}

export interface UserSocketServerEvents {
  "profile:updated": (data: PublicProfileDto) => void;
  "user:username-changed": (data: SocketUserUsernameChangedPayload) => void;
  "user:email-verified": (data: SocketUserEmailVerifiedPayload) => void;
  "user:privileges-changed": (
    data: SocketUserPrivilegesChangedPayload,
  ) => void;
  "user:online": (data: SocketUserPresencePayload) => void;
  "user:offline": (data: SocketUserPresencePayload) => void;
  "presence:init": (data: SocketPresenceInitPayload) => void;
}

export interface UserSocketClientEvents {
  "profile:subscribe": () => void;
}
