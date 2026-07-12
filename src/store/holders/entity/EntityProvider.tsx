import { type ReactNode } from "react";

import { EntityCtx } from "./useEntityContext";
import { useEntity, type UseEntityOptions, type UseEntityResult } from "./useEntityHolder";

export const EntityProvider = <TData, TArgs = void,>({
  children,
  value: externalValue,
  ...options
}: { children: ReactNode; value?: UseEntityResult<TData, TArgs> } & UseEntityOptions<TData, TArgs>) => {
  const result = useEntity<TData, TArgs>(options as unknown as UseEntityOptions<TData, TArgs>);
  const value = externalValue ?? result;

  return <EntityCtx.Provider value={value as any}>{children}</EntityCtx.Provider>;
};
