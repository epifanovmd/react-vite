import { type ReactNode } from "react";

import { PollingCtx } from "./usePollingContext";
import { usePolling, type UsePollingOptions, type UsePollingResult } from "./usePollingHolder";

export const PollingProvider = <TData, TArgs = void,>({
  children,
  value: externalValue,
  ...options
}: { children: ReactNode; value?: UsePollingResult<TData, TArgs> } & UsePollingOptions<TData, TArgs>) => {
  const result = usePolling<TData, TArgs>(options as unknown as UsePollingOptions<TData, TArgs>);
  const value = externalValue ?? result;

  return <PollingCtx.Provider value={value as any}>{children}</PollingCtx.Provider>;
};
