import { createContext } from "react";

import { type IHolderError } from "../Holder.types";
import { useCtx } from "../hooks/contextHelpers";
import { type UsePollingResult } from "./usePollingHolder";

export const PollingCtx = createContext<UsePollingResult<any, any, any> | null>(null);

export const usePollingContext = <TData, TArgs = void, TError extends IHolderError = IHolderError,>(): UsePollingResult<TData, TArgs, TError> =>
  useCtx(PollingCtx, "Polling") as UsePollingResult<TData, TArgs, TError>;
