import * as React from "react";

export interface UseSearchQueryOptions {
  searchValue?: string;
  onSearch?: (query: string) => void;
}

export interface UseSearchQueryResult {
  query: string;
  setQuery: (q: string) => void;
}

/** Состояние поисковой строки; при переданном `searchValue` — controlled. */
export const useSearchQuery = ({
  searchValue,
  onSearch,
}: UseSearchQueryOptions): UseSearchQueryResult => {
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

  return { query, setQuery };
};
