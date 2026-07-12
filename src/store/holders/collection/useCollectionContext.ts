import { createContext } from "react";

import { type IHolderError } from "../Holder.types";
import { useCtx } from "../hooks/contextHelpers";
import { type UseCollectionResult } from "./useCollectionHolder";

export const CollectionCtx = createContext<UseCollectionResult<any, any, any> | null>(null);

export const useCollectionContext = <TItem, TArgs = void, TError extends IHolderError = IHolderError,>(): UseCollectionResult<TItem, TArgs, TError> =>
  useCtx(CollectionCtx, "Collection") as UseCollectionResult<TItem, TArgs, TError>;
