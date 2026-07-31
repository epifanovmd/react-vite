import * as React from "react";

import type { ISelectRef } from "../types";

export interface UseSelectRefOptions {
  ref: React.ForwardedRef<ISelectRef>;
  search: boolean;
  handleOpen: (nextOpen: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Предоставляет императивный ref-API: focus, blur, scrollTo, nativeElement.
 */
export function useSelectRef({
  ref,
  search,
  handleOpen,
  inputRef,
  triggerRef,
  listRef,
}: UseSelectRefOptions): void {
  React.useImperativeHandle(
    ref,
    () => ({
      focus() {
        if (search) {
          handleOpen(true);
          inputRef.current?.focus();
        } else {
          triggerRef.current?.focus();
        }
      },
      blur() {
        inputRef.current?.blur();
        triggerRef.current?.blur();
      },
      scrollTo(index: number) {
        const el = listRef.current?.children[index] as HTMLElement | undefined;

        el?.scrollIntoView({ block: "nearest" });
      },
      get nativeElement() {
        return triggerRef.current;
      },
    }),
    [search, handleOpen, inputRef, triggerRef, listRef],
  );
}
