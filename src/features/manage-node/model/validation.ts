import { z } from "zod";

/** Имя хоста или IP-адрес (v4 или v6). */
const HOST = /^[a-zA-Z0-9.:_-]+$/;

export const nodeFormSchema = z.object({
  name: z.string().trim().min(1, "Введите название.").max(120),
  host: z
    .string()
    .trim()
    .max(255)
    .regex(HOST, "Имя хоста или IP-адрес.")
    .or(z.literal("")),
  description: z.string().trim().max(2000),
});

export type TNodeForm = z.input<typeof nodeFormSchema>;
export type TNodeFormValues = z.output<typeof nodeFormSchema>;
