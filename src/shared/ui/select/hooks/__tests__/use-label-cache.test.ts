import { act, renderHook } from "@testing-library/react";

import { useLabelCache } from "../use-label-cache";

describe("useLabelCache", () => {
  it("updates labels, preserves seeded labels and falls back to the value", () => {
    const { result } = renderHook(() => useLabelCache<string>());

    act(() => {
      result.current.seedCache([{ value: "one", label: "Initial" }]);
      result.current.seedCache([{ value: "one", label: "Ignored" }]);
    });
    expect(result.current.getLabel("one")).toBe("Initial");

    act(() => {
      result.current.updateCache([{ value: "one", label: "Updated" }]);
    });
    expect(result.current.getLabel("one")).toBe("Updated");
    expect(result.current.getLabel("missing")).toBe("missing");
  });
});
