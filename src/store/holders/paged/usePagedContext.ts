import { createContext } from "react";

import { type IHolderError } from "../Holder.types";
import { useCtx } from "../hooks/contextHelpers";
import { type UsePagedResult } from "./usePagedHolder";

export const PagedCtx = createContext<UsePagedResult<any, any, any> | null>(null);

export const usePagedContext = <TItem, TArgs = void, TError extends IHolderError = IHolderError,>(): UsePagedResult<TItem, TArgs, TError> =>
  useCtx(PagedCtx, "Paged") as UsePagedResult<TItem, TArgs, TError>;
