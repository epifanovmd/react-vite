export interface SocketServerToClientEvents {
  __: (data: unknown) => void;
  auth_error: (data: { message: string }) => void;
}

export interface SocketClientToServerEvents {
  __: () => void;
}
