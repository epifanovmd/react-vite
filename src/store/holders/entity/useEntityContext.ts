import { createContext } from "react";

import { type IHolderError } from "../Holder.types";
import { useCtx } from "../hooks/contextHelpers";
import { type UseEntityResult } from "./useEntityHolder";

export const EntityCtx = createContext<UseEntityResult<any, any, any> | null>(null);

export const useEntityContext = <TData, TArgs = void, TError extends IHolderError = IHolderError,>(): UseEntityResult<TData, TArgs, TError> =>
  useCtx(EntityCtx, "Entity") as UseEntityResult<TData, TArgs, TError>;
