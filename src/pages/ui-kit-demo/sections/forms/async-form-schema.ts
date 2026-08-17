import { z } from "zod";

export const asyncFormSchema = z.object({
  username: z
    .string()
    .min(3, "Минимум 3 символа")
    .regex(/^[a-z0-9]+$/i, "Только латинские буквы и цифры"),
});

export type AsyncFormValues = z.input<typeof asyncFormSchema>;
