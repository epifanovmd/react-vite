import { createContext } from "react";

import { type IHolderError } from "../Holder.types";
import { useCtx } from "../hooks/contextHelpers";
import { type UseInfiniteResult } from "./useInfiniteHolder";

export const InfiniteCtx = createContext<UseInfiniteResult<any, any, any> | null>(null);

export const useInfiniteContext = <TItem, TArgs = void, TError extends IHolderError = IHolderError,>(): UseInfiniteResult<TItem, TArgs, TError> =>
  useCtx(InfiniteCtx, "Infinite") as UseInfiniteResult<TItem, TArgs, TError>;
