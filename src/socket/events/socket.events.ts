/** All events the server emits → client listens */
export interface SocketServerToClientEvents {
  __: (data: unknown) => void;
  /** Server signals an authentication problem (expired/invalid token). */
  auth_error: (data: { message: string }) => void;
}

/** All events the client emits → server listens */
export interface SocketClientToServerEvents {
  __: () => void;
}
