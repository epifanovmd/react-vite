import * as React from "react";

import type { SelectDataProps, SelectOption, SelectValue } from "../types";
import { filterByLabel } from "./filterByLabel";

export interface UseStaticOptionsConfig {
  search?: boolean;
}

export const useStaticOptions = <V extends SelectValue>(
  options: SelectOption<V>[],
  { search }: UseStaticOptionsConfig = {},
): SelectDataProps<V> => {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(
    () => (search ? filterByLabel(options, query) : options),
    [options, query, search],
  );

  if (!search) return { options };

  return {
    options: filtered,
    search: true,
    searchValue: query,
    onSearch: setQuery,
  };
};
