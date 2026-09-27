import { describe, expect, it, vi } from "vitest";

import { createAsyncFormSchema } from "../async-form-schema";

describe("createAsyncFormSchema", () => {
  it("awaits availability validation as part of schema parsing", async () => {
    const checkUsernameAvailability = vi.fn(async () => false);
    const schema = createAsyncFormSchema(checkUsernameAvailability);

    const result = await schema.safeParseAsync({ username: "admin" });

    expect(result.success).toBe(false);
    expect(checkUsernameAvailability).toHaveBeenCalledWith("admin");
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["username"]);
    }
  });

  it("does not call remote validation when local validation fails", async () => {
    const checkUsernameAvailability = vi.fn(async () => true);
    const schema = createAsyncFormSchema(checkUsernameAvailability);

    const result = await schema.safeParseAsync({ username: "a" });

    expect(result.success).toBe(false);
    expect(checkUsernameAvailability).not.toHaveBeenCalled();
  });
});
