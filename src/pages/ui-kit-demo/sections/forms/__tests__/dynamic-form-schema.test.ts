import { describe, expect, it } from "vitest";

import { dynamicFormSchema } from "../dynamic-form-schema";

describe("dynamicFormSchema", () => {
  it("omits inactive fields from validation and parsed output", () => {
    const result = dynamicFormSchema.safeParse({
      hasInn: false,
      inn: "invalid stale value",
      needsDelivery: false,
      address: 42,
    });

    expect(result).toEqual({
      success: true,
      data: { hasInn: false, needsDelivery: false },
    });
  });

  it("requires and validates a field in the active INN branch", () => {
    const missing = dynamicFormSchema.safeParse({
      hasInn: true,
      needsDelivery: false,
    });
    const invalid = dynamicFormSchema.safeParse({
      hasInn: true,
      inn: "123",
      needsDelivery: false,
    });

    expect(missing.success).toBe(false);
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      expect(invalid.error.issues[0]?.path).toEqual(["inn"]);
    }
  });

  it("composes independent dynamic sections", () => {
    const result = dynamicFormSchema.safeParse({
      hasInn: true,
      inn: "1234567890",
      needsDelivery: true,
      address: "  Москва  ",
    });

    expect(result).toEqual({
      success: true,
      data: {
        hasInn: true,
        inn: "1234567890",
        needsDelivery: true,
        address: "Москва",
      },
    });
  });

  it("requires the address only in the delivery branch", () => {
    const result = dynamicFormSchema.safeParse({
      hasInn: false,
      needsDelivery: true,
      address: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["address"]);
    }
  });
});
