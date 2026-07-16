import { functionalUpdate, type OnChangeFn } from "@tanstack/react-table";
import { useCallback, useRef, useState } from "react";

export interface ControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export const useControllableState = <T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>): [T, OnChangeFn<T>, boolean] => {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;

  const currentRef = useRef(current);

  currentRef.current = current;

  const setState = useCallback<OnChangeFn<T>>(
    updater => {
      const next = functionalUpdate(updater, currentRef.current);

      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [current, setState, isControlled];
};
