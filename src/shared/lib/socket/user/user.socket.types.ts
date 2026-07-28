import { PrivacySettingsDto, PublicProfileDto, SessionDto } from "@shared/api/gen/model";
import { createInjectDecorator } from "@shared/lib/di";

import {
  SocketSessionPayload,
  SocketUserEmailVerifiedPayload,
  SocketUserPasswordChangedPayload,
  SocketUserPrivilegesChangedPayload,
  SocketUserUsernameChangedPayload,
} from "../events";

export interface UserSocketHandlers {
  onProfileUpdated?: (data: PublicProfileDto) => void;
  onUsernameChanged?: (data: SocketUserUsernameChangedPayload) => void;
  onEmailVerified?: (data: SocketUserEmailVerifiedPayload) => void;
  onPrivilegesChanged?: (data: SocketUserPrivilegesChangedPayload) => void;
  onPrivacyChanged?: (data: PrivacySettingsDto) => void;
  onNewSession?: (data: SessionDto) => void;
  onSessionTerminated?: (data: SocketSessionPayload) => void;
  /** Уведомление о смене пароля — security-нотификация, не мутирует стор. */
  onPasswordChanged?: (data: SocketUserPasswordChangedPayload) => void;
}

export const IUserSocketService = createInjectDecorator<IUserSocketService>();

export interface IUserSocketService {
  subscribe(handlers: UserSocketHandlers): () => void;
}
