import { z } from "zod";

export const fieldArraySchema = z.object({
  contacts: z
    .array(
      z.object({
        label: z.string().min(1, "Укажите название"),
        value: z.string().min(3, "Укажите контакт"),
      }),
    )
    .min(1, "Добавьте хотя бы один контакт"),
});

export type FieldArrayFormValues = z.input<typeof fieldArraySchema>;
