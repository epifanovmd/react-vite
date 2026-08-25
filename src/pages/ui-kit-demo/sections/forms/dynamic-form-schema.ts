import { createBooleanDiscriminatedUnion } from "@shared/lib/validation";
import { z } from "zod";

const customerSectionBaseSchema = z.object({
  customerType: z.enum(["person", "company"]),
  country: z.enum(["RU", "KZ"]),
  inn: z.string().regex(/^\d{10}$/, "ИНН должен состоять из 10 цифр"),
});

/**
 * Ветка ИНН зависит от комбинации двух полей. Сначала выбирается тип клиента,
 * затем для компании выбирается страна. ИНН существует только в комбинации
 * customerType="company" и country="RU".
 */
const personSchema = customerSectionBaseSchema
  .omit({ inn: true })
  .extend({ customerType: z.literal("person") });

const russianCompanySchema = customerSectionBaseSchema.extend({
  customerType: z.literal("company"),
  country: z.literal("RU"),
});

const foreignCompanySchema = customerSectionBaseSchema
  .omit({ inn: true })
  .extend({
    customerType: z.literal("company"),
    country: z.literal("KZ"),
  });

const companySchema = z.discriminatedUnion("country", [
  russianCompanySchema,
  foreignCompanySchema,
]);

const customerSectionSchema = z.discriminatedUnion("customerType", [
  personSchema,
  companySchema,
]);

export const isInnRequired = (
  customerType: "person" | "company",
  country: "RU" | "KZ",
): boolean => customerType === "company" && country === "RU";

const deliverySectionBaseSchema = z.object({
  address: z.string().trim().min(1, "Укажите адрес доставки"),
});

const deliverySectionSchema = createBooleanDiscriminatedUnion({
  discriminator: "needsDelivery",
  enabled: deliverySectionBaseSchema,
  disabled: deliverySectionBaseSchema.omit({ address: true }),
});

/** Независимые динамические секции объединяются без перебора комбинаций. */
export const dynamicFormSchema = z.intersection(
  customerSectionSchema,
  deliverySectionSchema,
);

export type DynamicFormValues = z.input<typeof dynamicFormSchema>;
export type DynamicFormResult = z.output<typeof dynamicFormSchema>;
