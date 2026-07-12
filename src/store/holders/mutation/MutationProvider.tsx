import { type ReactNode } from "react";

import { MutationCtx } from "./useMutationContext";
import { useMutation, type UseMutationOptions, type UseMutationResult } from "./useMutationHolder";

export const MutationProvider = <TArgs = void, TData = void,>({
  children,
  value: externalValue,
  ...options
}: { children: ReactNode; value?: UseMutationResult<TArgs, TData> } & UseMutationOptions<TArgs, TData>) => {
  const result = useMutation<TArgs, TData>(options as unknown as UseMutationOptions<TArgs, TData>);
  const value = externalValue ?? result;

  return <MutationCtx.Provider value={value as any}>{children}</MutationCtx.Provider>;
};
