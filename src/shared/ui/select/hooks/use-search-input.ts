import * as React from "react";
import { type ComponentPropsWithRef } from "react";

import { selectSearchInputClasses } from "../select-variants";

export interface UseSearchInputOptions {
  inputRef: React.RefObject<HTMLInputElement | null>;
  open: boolean;
  setQuery: (q: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export interface UseSearchInputResult {
  searchInputProps: ComponentPropsWithRef<"input">;
}

/**
 * Конструирует пропсы для поискового `<input>` внутри триггера.
 */
export function useSearchInput({
  inputRef,
  open,
  setQuery,
  handleKeyDown,
}: UseSearchInputOptions): UseSearchInputResult {
  const searchInputProps: ComponentPropsWithRef<"input"> = React.useMemo(
    () => ({
      ref: inputRef,
      className: selectSearchInputClasses,
      readOnly: !open,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setQuery(e.target.value),
      onKeyDown: handleKeyDown,
      onPointerDown: (e: React.PointerEvent) => {
        if (open) e.stopPropagation();
      },
    }),
    [inputRef, open, setQuery, handleKeyDown],
  );

  return { searchInputProps };
}
