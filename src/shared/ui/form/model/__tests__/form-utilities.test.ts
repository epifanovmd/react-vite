import { describe, expect, it, vi } from "vitest";

import { applyServerErrors } from "../apply-server-errors";
import { normalizeEmptyString } from "../normalize-empty-string";

describe("form utilities", () => {
  it("normalizes an empty HTML value without changing other values", () => {
    expect(normalizeEmptyString("")).toBeUndefined();
    expect(normalizeEmptyString("value")).toBe("value");
    expect(normalizeEmptyString(0)).toBe(0);
  });

  it("applies field and root server errors and focuses only the first field", () => {
    const setError = vi.fn();

    applyServerErrors<{ email: string }>(setError, [
      { name: "email", message: "Already used" },
      { name: "root", message: "Request failed" },
    ]);

    expect(setError).toHaveBeenNthCalledWith(
      1,
      "email",
      { type: "server", message: "Already used" },
      { shouldFocus: true },
    );
    expect(setError).toHaveBeenNthCalledWith(
      2,
      "root",
      { type: "server", message: "Request failed" },
      { shouldFocus: false },
    );
  });
});
