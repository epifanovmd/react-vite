import * as React from "react";

export interface UseSelectStateOptions {
  search?: boolean;
  searchValue?: string;
  onSearch?: (query: string) => void;
}

export interface UseSelectStateResult {
  open: boolean;
  query: string;
  setQuery: (q: string) => void;
  handleOpen: (
    nextOpen: boolean,
    inputRef?: React.RefObject<HTMLInputElement | null>,
  ) => void;
}

export function useSelectState({
  search,
  searchValue,
  onSearch,
}: UseSelectStateOptions): UseSelectStateResult {
  const [open, setOpen] = React.useState(false);
  const [internalQuery, setInternalQuery] = React.useState("");

  const isControlled = searchValue !== undefined;
  const query = isControlled ? searchValue : internalQuery;

  const setQuery = React.useCallback(
    (q: string) => {
      if (!isControlled) setInternalQuery(q);
      onSearch?.(q);
    },
    [isControlled, onSearch],
  );

  const handleOpen = React.useCallback(
    (
      nextOpen: boolean,
      inputRef?: React.RefObject<HTMLInputElement | null>,
    ) => {
      setOpen(nextOpen);
      if (!nextOpen) {
        setQuery("");
      } else if (search && inputRef) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    },
    [search, setQuery],
  );

  return { open, query, setQuery, handleOpen };
}
