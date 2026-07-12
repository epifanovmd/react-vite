import { useContext } from "react";

/**
 * Безопасное чтение контекста.
 * Кидает ошибку если компонент не внутри Provider.
 */
export const useCtx = <T,>(ctx: React.Context<T | null>, name: string): T => {
  const value = useContext(ctx);

  if (!value) throw new Error(`use${name}Context must be used within ${name}Provider`);

  return value;
};
