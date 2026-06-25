import * as React from "react";

import type {
  FilterOptionPredicate,
  SelectDataProps,
  SelectOption,
  SelectValue,
} from "../types";
import { filterByLabel } from "./filterByLabel";

export interface UseStaticOptionsConfig<V extends SelectValue = string> {
  search?: boolean;
  filterOption?: boolean | FilterOptionPredicate<V>;
}

export const useStaticOptions = <V extends SelectValue>(
  options: SelectOption<V>[],
  { search, filterOption }: UseStaticOptionsConfig<V> = {},
): SelectDataProps<V> => {
  const [query, setQuery] = React.useState("");

  const doFilter = search && filterOption !== false;

  const predicate =
    typeof filterOption === "function" ? filterOption : undefined;

  const filtered = React.useMemo(
    () => (doFilter ? filterByLabel(options, query, predicate) : options),
    [options, query, doFilter, predicate],
  );

  if (!search) return { options };

  return {
    options: filtered,
    search: true,
    searchValue: query,
    onSearch: setQuery,
  };
};
