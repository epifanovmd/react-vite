import type { SelectOption, SelectValue } from "../types";

export const filterByLabel = <V extends SelectValue>(
  list: SelectOption<V>[],
  query: string,
): SelectOption<V>[] => {
  if (!query) return list;
  const q = query.toLowerCase();

  return list.filter(o => String(o.label).toLowerCase().includes(q));
};
