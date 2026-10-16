import { z } from "zod";

export const newRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, "Не длиннее 100 символов.")
    .regex(
      /^[a-z][a-z0-9_-]*$/,
      "Строчная латиница, цифры, - и _; начинается с буквы.",
    ),
});

export type TNewRoleForm = z.infer<typeof newRoleSchema>;
