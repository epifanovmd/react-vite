import { describe, expect, it } from "vitest";

import { dynamicFormSchema } from "../dynamic-form-schema";

const baseValues = {
  customerType: "person" as const,
  country: "RU" as const,
  inn: "",
  delivery: "pickup" as const,
  address: "",
};

describe("dynamicFormSchema", () => {
  it("allows inactive conditional fields to be empty", () => {
    expect(dynamicFormSchema.safeParse(baseValues).success).toBe(true);
  });

  it("requires INN only for a Russian company", () => {
    const result = dynamicFormSchema.safeParse({
      ...baseValues,
      customerType: "company",
    });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.path).toEqual(["inn"]);
  });

  it("requires address only for courier delivery", () => {
    const result = dynamicFormSchema.safeParse({
      ...baseValues,
      delivery: "courier",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["address"]);
    }
  });
});
