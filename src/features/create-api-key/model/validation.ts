import { z } from "zod";

const SCOPE = /^(\*|[a-z][a-z0-9_-]*(:[a-z0-9_.*/-]+)?)$/;

export const createApiKeySchema = z.object({
  name: z.string().trim().min(1, "Введите название.").max(100),
  scopes: z
    .string()
    .transform(value => value.split(/[\s,]+/).filter(Boolean))
    .pipe(
      z
        .array(z.string().regex(SCOPE, "Неверный scope."))
        .min(1, "Укажите хотя бы один scope."),
    ),
  expiresAt: z.date().optional(),
});

export type TCreateApiKeyForm = z.input<typeof createApiKeySchema>;
export type TCreateApiKeyValues = z.output<typeof createApiKeySchema>;
