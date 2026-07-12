import { createContext } from "react";

import { type IHolderError } from "../Holder.types";
import { useCtx } from "../hooks/contextHelpers";
import { type UseMutationResult } from "./useMutationHolder";

export const MutationCtx = createContext<UseMutationResult<any, any, any> | null>(null);

export const useMutationContext = <TArgs = void, TData = void, TError extends IHolderError = IHolderError,>(): UseMutationResult<TArgs, TData, TError> =>
  useCtx(MutationCtx, "Mutation") as UseMutationResult<TArgs, TData, TError>;
