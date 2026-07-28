import { PrivacySettingsDto, PublicProfileDto, SessionDto } from "@shared/api/gen/model";

export interface SocketUserUsernameChangedPayload {
  userId: string;
  username: string | null;
}

export interface SocketUserEmailVerifiedPayload {
  verified: boolean;
}

export interface SocketUserPasswordChangedPayload {
  userId: string;
  method: "change" | "reset";
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

export interface SocketSessionPayload {
  sessionId: string;
}

export interface UserSocketServerEvents {
  "profile:updated": (data: PublicProfileDto) => void;
  "profile:privacy-changed": (data: PrivacySettingsDto) => void;
  "user:username-changed": (data: SocketUserUsernameChangedPayload) => void;
  "user:email-verified": (data: SocketUserEmailVerifiedPayload) => void;
  "user:password-changed": (data: SocketUserPasswordChangedPayload) => void;
  "user:privileges-changed": (
    data: SocketUserPrivilegesChangedPayload,
  ) => void;
  "user:online": (data: SocketUserPresencePayload) => void;
  "user:offline": (data: SocketUserPresencePayload) => void;
  "presence:init": (data: SocketPresenceInitPayload) => void;
  "session:new": (data: SessionDto) => void;
  "session:terminated": (data: SocketSessionPayload) => void;
}

export interface UserSocketClientEvents {
  "profile:subscribe": () => void;
}
