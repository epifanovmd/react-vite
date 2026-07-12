import { type ReactNode } from "react";

import { InfiniteCtx } from "./useInfiniteContext";
import { useInfinite, type UseInfiniteOptions, type UseInfiniteResult } from "./useInfiniteHolder";

export const InfiniteProvider = <TItem, TArgs = void,>({
  children,
  value: externalValue,
  ...options
}: { children: ReactNode; value?: UseInfiniteResult<TItem, TArgs> } & UseInfiniteOptions<TItem, TArgs>) => {
  const result = useInfinite<TItem, TArgs>(options as unknown as UseInfiniteOptions<TItem, TArgs>);
  const value = externalValue ?? result;

  return <InfiniteCtx.Provider value={value as any}>{children}</InfiniteCtx.Provider>;
};
