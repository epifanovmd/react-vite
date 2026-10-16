import { useCallback, useSyncExternalStore } from "react";

import { ISocketTransport, SocketTransportState } from "../transport";

/** Текущее состояние сокета; смена статуса до подписки не теряется. */
export const useSocketStatus = (): SocketTransportState => {
  const transport = ISocketTransport.useInstance();

  const subscribe = useCallback(
    (onChange: () => void) => transport.onStatusChange(onChange),
    [transport],
  );
  const getSnapshot = useCallback(() => transport.state, [transport]);

  return useSyncExternalStore(subscribe, getSnapshot);
};

export const useIsSocketConnected = (): boolean => {
  const { status } = useSocketStatus();

  return status === "connected";
};
