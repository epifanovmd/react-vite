import * as React from "react";

import type { SelectOption, SelectOptionGroup, SelectValue } from "../types";

export interface UseFlatOptionsOptions<V extends SelectValue> {
  groups: SelectOptionGroup<V>[];
}

/**
 * Разворачивает сгруппированные опции в плоский массив.
 */
export const useFlatOptions = <V extends SelectValue>({
  groups,
}: UseFlatOptionsOptions<V>): SelectOption<V>[] =>
  React.useMemo<SelectOption<V>[]>(
    () => groups.flatMap(g => g.options as SelectOption<V>[]),
    [groups],
  );
