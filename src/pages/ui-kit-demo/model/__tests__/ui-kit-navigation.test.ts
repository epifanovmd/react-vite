import type { UISection } from "../../sections";
import {
  findNeighbours,
  groupSections,
  orderSections,
} from "../ui-kit-navigation";

const noop = () => null;

const section = (
  value: string,
  label: string,
  group: UISection["group"],
): UISection => ({
  value,
  label,
  group,
  description: `Про ${label}`,
  Component: noop,
});

const SECTIONS: UISection[] = [
  section("table", "Таблица", "data"),
  section("buttons", "Кнопки", "foundation"),
  section("inputs", "Поля ввода", "inputs"),
  section("badges", "Бейджи", "foundation"),
];

describe("ui-kit navigation", () => {
  it("группирует разделы в порядке групп сайдбара", () => {
    const groups = groupSections(SECTIONS);

    expect(groups.map(group => group.id)).toEqual([
      "foundation",
      "inputs",
      "data",
    ]);
    expect(groups[0].sections.map(item => item.value)).toEqual([
      "buttons",
      "badges",
    ]);
  });

  it("ищет по названию без учёта регистра и прячет пустые группы", () => {
    const groups = groupSections(SECTIONS, "  ТАБЛ ");

    expect(groups).toHaveLength(1);
    expect(groups[0].sections[0].value).toBe("table");
  });

  it("находит соседей в порядке сайдбара", () => {
    const ordered = orderSections(SECTIONS);

    expect(findNeighbours(ordered, "badges")).toEqual({
      previous: expect.objectContaining({ value: "buttons" }),
      next: expect.objectContaining({ value: "inputs" }),
    });
    expect(findNeighbours(ordered, "unknown")).toEqual({});
  });
});
