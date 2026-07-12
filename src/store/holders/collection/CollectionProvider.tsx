import { type ReactNode } from "react";

import { CollectionCtx } from "./useCollectionContext";
import { useCollection, type UseCollectionOptions, type UseCollectionResult } from "./useCollectionHolder";

export const CollectionProvider = <TItem, TArgs = void,>({
  children,
  value: externalValue,
  ...options
}: { children: ReactNode; value?: UseCollectionResult<TItem, TArgs> } & UseCollectionOptions<TItem, TArgs>) => {
  const result = useCollection<TItem, TArgs>(options as unknown as UseCollectionOptions<TItem, TArgs>);
  const value = externalValue ?? result;

  return <CollectionCtx.Provider value={value as any}>{children}</CollectionCtx.Provider>;
};
