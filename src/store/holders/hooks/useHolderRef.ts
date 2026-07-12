import { useRef } from "react";

/**
 * Создаёт экземпляр класса в `useRef`.
 * Гарантирует стабильную ссылку на всё время жизни компонента.
 *
 * @example
 * ```ts
 * const holder = useHolderRef(() => new EntityHolder(options));
 * ```
 */
export const useHolderRef = <T,>(factory: () => T): T => {
  const ref = useRef<T | null>(null);

  if (!ref.current) {
    ref.current = factory();
  }

  return ref.current;
};
