import {
  selectContentClasses,
  selectItemClasses,
  selectItemHighlightedClasses,
  selectSearchInputClasses,
  selectTriggerVariants,
} from "../select-variants";

describe("select variants", () => {
  it("exports stable structural classes", () => {
    expect(selectContentClasses).toContain("bg-popover");
    expect(selectItemClasses).toContain("cursor-pointer");
    expect(selectItemHighlightedClasses).toBe(
      "bg-accent text-accent-foreground",
    );
    expect(selectSearchInputClasses).toContain("cursor-text");
  });

  it("builds default and validation trigger variants", () => {
    expect(selectTriggerVariants()).toContain("items-center");
    expect(selectTriggerVariants({ valid: true })).toContain(
      "shadow-state-success",
    );
    expect(selectTriggerVariants({ valid: false })).toContain(
      "shadow-state-error",
    );
  });
});
