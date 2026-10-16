/** @deprecated Транспорт не получает `authenticated`: авторизация идёт в handshake. */
export interface SocketAuthenticatedPayload {
  userId: string;
}

/** @deprecated Отказ авторизации приходит как `connect_error` handshake. */
export interface SocketAuthErrorPayload {
  message: string;
}

/** @deprecated Транспорт не обрабатывает серверное событие `error`. */
export interface SocketErrorPayload {
  event: string;
  message: string;
}

/** @deprecated Транспорт не отправляет `ping`: keep-alive делает socket.io. */
export interface SocketPingPayload {
  ts: number;
}

/** Серверная комната `type:id`. */
export interface SocketRoomPayload {
  type: string;
  id: string;
}

/** Ответ сервера на вход в комнату. */
export interface SocketRoomAck {
  ok: boolean;
  error?: { code: string; message: string };
}

/** Новый access-токен для живого соединения. */
export interface SocketAuthRefreshPayload {
  accessToken: string;
}

/** События сервера, которые обрабатывает транспорт и подписки на комнаты. */
export interface SocketServerToClientEvents {
  /** Срок токена соединения истекает — клиент присылает новый `auth:refresh`. */
  "auth:expired": () => void;
  /** Право на комнату отозвано — повторный вход не нужен. */
  "room:revoked": (room: SocketRoomPayload) => void;
  /** @deprecated Сервер не присылает. */
  authenticated: (data: SocketAuthenticatedPayload) => void;
  /** @deprecated Сервер не присылает. */
  auth_error: (data: SocketAuthErrorPayload) => void;
  /** @deprecated Сервер не присылает. */
  error: (data: SocketErrorPayload) => void;
}

/** События, которые отправляют транспорт и подписки на комнаты. */
export interface SocketClientToServerEvents {
  "auth:refresh": (data: SocketAuthRefreshPayload) => void;
  "room:subscribe": (
    room: SocketRoomPayload,
    ack: (result: SocketRoomAck) => void,
  ) => void;
  "room:unsubscribe": (room: SocketRoomPayload) => void;
  /** @deprecated Транспорт не отправляет. */
  ping: (data: SocketPingPayload) => void;
}
