import { z } from "zod";

export const dynamicRules = {
  innRequired: (customerType: string, country: string): boolean =>
    customerType === "company" && country === "RU",
  addressRequired: (delivery: string): boolean => delivery === "courier",
};

export const dynamicFormSchema = z
  .object({
    customerType: z.enum(["person", "company"]),
    country: z.enum(["RU", "KZ"]),
    inn: z.string(),
    delivery: z.enum(["pickup", "courier"]),
    address: z.string(),
  })
  .superRefine((values, context) => {
    if (dynamicRules.innRequired(values.customerType, values.country)) {
      if (!/^\d{10}$/.test(values.inn)) {
        context.addIssue({
          code: "custom",
          path: ["inn"],
          message: "Для российской компании нужен ИНН из 10 цифр",
        });
      }
    }

    if (dynamicRules.addressRequired(values.delivery) && !values.address) {
      context.addIssue({
        code: "custom",
        path: ["address"],
        message: "Укажите адрес курьерской доставки",
      });
    }
  });

export type DynamicFormValues = z.input<typeof dynamicFormSchema>;
