import { renderHook } from "@testing-library/react";

import { useFlatOptions } from "../use-flat-options";

describe("useFlatOptions", () => {
  it("flattens groups and memoizes the result by groups reference", () => {
    const groups = [
      { group: "A", options: [{ value: "a", label: "A" }] },
      { group: "B", options: [{ value: "b", label: "B" }] },
    ];
    const hook = renderHook(({ value }) => useFlatOptions({ groups: value }), {
      initialProps: { value: groups },
    });
    const first = hook.result.current;

    expect(first.map(option => option.value)).toEqual(["a", "b"]);

    hook.rerender({ value: groups });
    expect(hook.result.current).toBe(first);
  });
});
