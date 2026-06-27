import { UserSocketClientEvents, UserSocketServerEvents } from "./User.events";

export interface SocketAuthenticatedPayload {
  userId: string;
}

export interface SocketAuthErrorPayload {
  message: string;
}

export interface SocketErrorPayload {
  event: string;
  message: string;
}

export interface SocketPingPayload {
  ts: number;
}

export interface SocketServerToClientEvents extends UserSocketServerEvents {
  authenticated: (data: SocketAuthenticatedPayload) => void;
  auth_error: (data: SocketAuthErrorPayload) => void;
  error: (data: SocketErrorPayload) => void;
}

export interface SocketClientToServerEvents extends UserSocketClientEvents {
  ping: (data: SocketPingPayload) => void;
}
