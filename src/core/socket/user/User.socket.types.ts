import { PublicProfileDto } from "@api/gen/model";
import { createServiceDecorator } from "@di";

import {
  SocketUserEmailVerifiedPayload,
  SocketUserPrivilegesChangedPayload,
  SocketUserUsernameChangedPayload,
} from "../events";

export interface UserSocketHandlers {
  onProfileUpdated?: (data: PublicProfileDto) => void;
  onUsernameChanged?: (data: SocketUserUsernameChangedPayload) => void;
  onEmailVerified?: (data: SocketUserEmailVerifiedPayload) => void;
  onPrivilegesChanged?: (data: SocketUserPrivilegesChangedPayload) => void;
}

export const IUserSocketService = createServiceDecorator<IUserSocketService>();

export interface IUserSocketService {
  subscribe(handlers: UserSocketHandlers): () => void;
}
