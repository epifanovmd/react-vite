import { useMemo } from "react";

import { UI_SECTIONS, type UISection } from "../sections";
import {
  findNeighbours,
  orderSections,
  UI_SECTION_GROUP_LABELS,
  type UISectionNeighbours,
} from "./ui-kit-navigation";

const ORDERED_SECTIONS = orderSections(UI_SECTIONS);

/** Первый раздел в порядке сайдбара — цель редиректа с `/ui`. */
export const DEFAULT_SECTION = ORDERED_SECTIONS[0].value;

export interface CurrentSection extends UISectionNeighbours {
  section?: UISection;
  groupLabel?: string;
}

export const useCurrentSection = (value: string): CurrentSection =>
  useMemo(() => {
    const section = ORDERED_SECTIONS.find(item => item.value === value);

    return {
      section,
      groupLabel: section && UI_SECTION_GROUP_LABELS[section.group],
      ...findNeighbours(ORDERED_SECTIONS, value),
    };
  }, [value]);
