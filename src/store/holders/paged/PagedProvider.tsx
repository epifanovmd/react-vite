import { type ReactNode } from "react";

import { PagedCtx } from "./usePagedContext";
import { usePaged, type UsePagedOptions, type UsePagedResult } from "./usePagedHolder";

export const PagedProvider = <TItem, TArgs = void,>({
  children,
  value: externalValue,
  ...options
}: { children: ReactNode; value?: UsePagedResult<TItem, TArgs> } & UsePagedOptions<TItem, TArgs>) => {
  const result = usePaged<TItem, TArgs>(options as unknown as UsePagedOptions<TItem, TArgs>);
  const value = externalValue ?? result;

  return <PagedCtx.Provider value={value as any}>{children}</PagedCtx.Provider>;
};
