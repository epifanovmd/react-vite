import { createDisposer } from "@di";

import { ISocketTransport } from "../transport";
import { IUserSocketService, UserSocketHandlers } from "./User.socket.types";

@IUserSocketService({ inSingleton: true })
export class UserSocketService implements IUserSocketService {
  constructor(@ISocketTransport() private _transport: ISocketTransport) {}

  subscribe(handlers: UserSocketHandlers): () => void {
    const disposers = createDisposer();

    if (handlers.onProfileUpdated) {
      this._transport.emit("profile:subscribe");
      disposers.add(
        this._transport.onConnect(() => {
          this._transport.emit("profile:subscribe");
        }),
        this._transport.on("profile:updated", handlers.onProfileUpdated),
      );
    }
    if (handlers.onUsernameChanged) {
      disposers.add(
        this._transport.on("user:username-changed", handlers.onUsernameChanged),
      );
    }
    if (handlers.onEmailVerified) {
      disposers.add(
        this._transport.on("user:email-verified", handlers.onEmailVerified),
      );
    }
    if (handlers.onPrivilegesChanged) {
      disposers.add(
        this._transport.on(
          "user:privileges-changed",
          handlers.onPrivilegesChanged,
        ),
      );
    }

    return disposers.dispose;
  }
}
