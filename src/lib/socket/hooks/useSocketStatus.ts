import { iocHook } from "@di";
import { useEffect, useState } from "react";

import { ISocketTransport, SocketTransportState } from "../transport";

export function useSocketStatus(): SocketTransportState {
  const transport = iocHook(ISocketTransport)();
  const [state, setState] = useState<SocketTransportState>(transport.state);

  useEffect(() => {
    return transport.onStatusChange(setState);
  }, [transport]);

  return state;
}

export function useIsSocketConnected(): boolean {
  const { status } = useSocketStatus();

  return status === "connected";
}
