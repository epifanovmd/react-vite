import { z } from "zod";

export const resetPasswordFormValidationSchema = z
  .object({
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
    confirmPassword: z.string().min(1, "Подтвердите пароль"),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type TResetPasswordForm = z.infer<typeof resetPasswordFormValidationSchema>;
