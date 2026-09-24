import { useMemo, useState } from "react";

import { UI_SECTIONS } from "../sections";
import { groupSections, type UISectionGroupView } from "./ui-kit-navigation";

export interface UseSectionSearchResult {
  query: string;
  setQuery: (query: string) => void;
  groups: UISectionGroupView[];
}

/** Поиск по разделам сайдбара: общий для десктопа и мобильной панели. */
export const useSectionSearch = (): UseSectionSearchResult => {
  const [query, setQuery] = useState("");
  const groups = useMemo(() => groupSections(UI_SECTIONS, query), [query]);

  return { query, setQuery, groups };
};
