import { useCallback, useRef, useState } from "react";

export type StateUpdater<T> = T | ((prev: T) => T);

export interface ControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export const useControllableState = <T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>): [T, (updater: StateUpdater<T>) => void] => {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;

  const currentRef = useRef(current);

  currentRef.current = current;

  const setState = useCallback(
    (updater: StateUpdater<T>) => {
      const next =
        typeof updater === "function"
          ? (updater as (prev: T) => T)(currentRef.current)
          : updater;

      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [current, setState];
};
