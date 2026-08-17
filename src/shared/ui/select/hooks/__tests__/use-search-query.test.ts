import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

import { useSearchQuery } from "../use-search-query";

describe("useSearchQuery", () => {
  it("owns an uncontrolled query and reports changes", () => {
    const onSearch = vi.fn();
    const { result } = renderHook(() => useSearchQuery({ onSearch }));

    act(() => result.current.setQuery("text"));
    expect(result.current.query).toBe("text");
    expect(onSearch).toHaveBeenCalledWith("text");
  });

  it("does not mutate a controlled query", () => {
    const onSearch = vi.fn();
    const { result } = renderHook(() =>
      useSearchQuery({ onSearch, searchValue: "external" }),
    );

    act(() => result.current.setQuery("next"));
    expect(result.current.query).toBe("external");
    expect(onSearch).toHaveBeenCalledWith("next");
  });
});
