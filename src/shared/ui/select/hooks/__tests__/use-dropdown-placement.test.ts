import { renderHook } from "@testing-library/react";

import { useDropdownPlacement } from "../use-dropdown-placement";

describe("useDropdownPlacement", () => {
  it("picks placement props and memoizes them", () => {
    const props = {
      dropdownAlign: "end" as const,
      dropdownSide: "top" as const,
      dropdownSideOffset: 8,
      unrelated: "ignored",
    };
    const hook = renderHook(value => useDropdownPlacement(value), {
      initialProps: props,
    });
    const first = hook.result.current;

    expect(first).toEqual({
      dropdownAlign: "end",
      dropdownSide: "top",
      dropdownSideOffset: 8,
    });

    hook.rerender(props);
    expect(hook.result.current).toBe(first);
  });
});
