import type { UISection, UISectionGroup } from "../sections";

export interface UISectionGroupView {
  id: UISectionGroup;
  label: string;
  sections: UISection[];
}

/** Порядок и подписи групп в сайдбаре. */
export const UI_SECTION_GROUP_LABELS: Record<UISectionGroup, string> = {
  foundation: "Основы",
  inputs: "Ввод данных",
  navigation: "Навигация",
  feedback: "Обратная связь",
  data: "Данные",
};

const GROUP_ORDER = Object.keys(UI_SECTION_GROUP_LABELS) as UISectionGroup[];

const normalize = (text: string) => text.trim().toLocaleLowerCase("ru");

const matchesQuery = (section: UISection, query: string) =>
  normalize(section.label).includes(query) ||
  section.value.includes(query) ||
  normalize(section.description).includes(query);

/** Секции по группам; пустые после поиска группы не возвращаются. */
export const groupSections = (
  sections: UISection[],
  rawQuery = "",
): UISectionGroupView[] => {
  const query = normalize(rawQuery);
  const visible = query
    ? sections.filter(section => matchesQuery(section, query))
    : sections;

  return GROUP_ORDER.map(id => ({
    id,
    label: UI_SECTION_GROUP_LABELS[id],
    sections: visible.filter(section => section.group === id),
  })).filter(group => group.sections.length > 0);
};

/** Секции в порядке сайдбара — по нему строятся «назад» и «вперёд». */
export const orderSections = (sections: UISection[]): UISection[] =>
  groupSections(sections).flatMap(group => group.sections);

export interface UISectionNeighbours {
  previous?: UISection;
  next?: UISection;
}

export const findNeighbours = (
  ordered: UISection[],
  value: string,
): UISectionNeighbours => {
  const index = ordered.findIndex(section => section.value === value);

  if (index === -1) return {};

  return { previous: ordered[index - 1], next: ordered[index + 1] };
};
