import { describe, expect, it } from "vitest";

import { dynamicFormSchema } from "../dynamic-form-schema";

describe("dynamicFormSchema", () => {
  it("omits inactive fields from validation and parsed output", () => {
    const result = dynamicFormSchema.safeParse({
      customerType: "person",
      country: "RU",
      inn: "invalid stale value",
      needsDelivery: false,
      address: 42,
    });

    expect(result).toEqual({
      success: true,
      data: {
        customerType: "person",
        country: "RU",
        needsDelivery: false,
      },
    });
  });

  it("requires INN only for the Russian company combination", () => {
    const missing = dynamicFormSchema.safeParse({
      customerType: "company",
      country: "RU",
      needsDelivery: false,
    });
    const invalid = dynamicFormSchema.safeParse({
      customerType: "company",
      country: "RU",
      inn: "123",
      needsDelivery: false,
    });

    expect(missing.success).toBe(false);
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      expect(invalid.error.issues[0]?.path).toEqual(["inn"]);
    }
  });

  it("omits INN for a foreign company", () => {
    const result = dynamicFormSchema.safeParse({
      customerType: "company",
      country: "KZ",
      inn: "invalid stale value",
      needsDelivery: false,
    });

    expect(result).toEqual({
      success: true,
      data: {
        customerType: "company",
        country: "KZ",
        needsDelivery: false,
      },
    });
  });

  it("composes independent dynamic sections", () => {
    const result = dynamicFormSchema.safeParse({
      customerType: "company",
      country: "RU",
      inn: "1234567890",
      needsDelivery: true,
      address: "  Москва  ",
    });

    expect(result).toEqual({
      success: true,
      data: {
        customerType: "company",
        country: "RU",
        inn: "1234567890",
        needsDelivery: true,
        address: "Москва",
      },
    });
  });

  it("requires the address only in the delivery branch", () => {
    const result = dynamicFormSchema.safeParse({
      customerType: "person",
      country: "RU",
      needsDelivery: true,
      address: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["address"]);
    }
  });
});
