import { z } from "zod";

const innSectionBaseSchema = z.object({
  hasInn: z.boolean(),
  inn: z.string().regex(/^\d{10}$/, "ИНН должен состоять из 10 цифр"),
});

/**
 * Every discriminator value owns a complete structural form variant.
 * An inactive field is omitted from the branch, so it is neither validated
 * nor present in the parsed result.
 */
const innSectionSchema = z.discriminatedUnion("hasInn", [
  innSectionBaseSchema.extend({ hasInn: z.literal(true) }),
  innSectionBaseSchema.omit({ inn: true }).extend({ hasInn: z.literal(false) }),
]);

const deliverySectionBaseSchema = z.object({
  needsDelivery: z.boolean(),
  address: z.string().trim().min(1, "Укажите адрес доставки"),
});

const deliverySectionSchema = z.discriminatedUnion("needsDelivery", [
  deliverySectionBaseSchema.extend({ needsDelivery: z.literal(true) }),
  deliverySectionBaseSchema
    .omit({ address: true })
    .extend({ needsDelivery: z.literal(false) }),
]);

/** Independent dynamic sections compose without enumerating every variant. */
export const dynamicFormSchema = z.intersection(
  innSectionSchema,
  deliverySectionSchema,
);

export type DynamicFormValues = z.input<typeof dynamicFormSchema>;
export type DynamicFormResult = z.output<typeof dynamicFormSchema>;
