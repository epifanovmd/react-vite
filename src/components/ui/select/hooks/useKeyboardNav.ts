import * as React from "react";

export interface UseKeyboardNavProps {
  count: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export interface UseKeyboardNavResult {
  focusedIndex: number;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
}

export function useKeyboardNav({
  count,
  onSelect,
  onClose,
}: UseKeyboardNavProps): UseKeyboardNavResult {
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const listRef = React.useRef<HTMLDivElement>(null);

  const onSelectRef = React.useRef(onSelect);
  const onCloseRef = React.useRef(onClose);
  const focusedIndexRef = React.useRef(focusedIndex);

  onSelectRef.current = onSelect;
  onCloseRef.current = onClose;
  focusedIndexRef.current = focusedIndex;

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex(i => Math.min(i + 1, count - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex(i => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIndexRef.current >= 0)
            onSelectRef.current(focusedIndexRef.current);
          break;
        case "Escape":
          e.preventDefault();
          onCloseRef.current();
          break;
        case "Tab":
          onCloseRef.current();
          break;
      }
    },
    [count],
  );

  React.useEffect(() => {
    if (focusedIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[focusedIndex] as
      | HTMLElement
      | undefined;

    item?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex]);

  React.useEffect(() => {
    setFocusedIndex(-1);
  }, [count]);

  return { focusedIndex, setFocusedIndex, handleKeyDown, listRef };
}
