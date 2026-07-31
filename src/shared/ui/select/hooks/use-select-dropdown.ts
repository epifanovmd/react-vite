import * as React from "react";

export interface UseSelectDropdownOptions {
  search: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onScrollEnd?: () => void;
}

export interface UseSelectDropdownResult {
  onInteractOutside: (e: Event) => void;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

/**
 * Поведение дропдауна: защита от закрытия по клику на триггер в режиме
 * поиска и обнаружение скролла до конца списка (infinite scroll).
 */
export const useSelectDropdown = ({
  search,
  inputRef,
  onScrollEnd,
}: UseSelectDropdownOptions): UseSelectDropdownResult => {
  const onInteractOutside = React.useCallback(
    (e: Event) => {
      if (!search) return;
      if (
        inputRef.current &&
        e.target instanceof Node &&
        inputRef.current
          .closest("[data-radix-popover-trigger]")
          ?.contains(e.target)
      ) {
        e.preventDefault();
      }
    },
    [search, inputRef],
  );

  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!onScrollEnd) return;
      const el = e.currentTarget;

      if (el.scrollHeight - el.scrollTop - el.clientHeight < 48) onScrollEnd();
    },
    [onScrollEnd],
  );

  return { onInteractOutside, handleScroll };
};
