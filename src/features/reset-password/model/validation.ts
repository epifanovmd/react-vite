import { passwordValidation } from "@entities/auth";
import { refineFormField } from "@shared/lib/validation";
import { z } from "zod";

const resetPasswordFormBaseSchema = z.object({
  password: passwordValidation,
  confirmPassword: z.string().min(1, "Подтвердите пароль"),
});

export const resetPasswordFormValidationSchema = refineFormField(
  resetPasswordFormBaseSchema,
  {
    field: "confirmPassword",
    check: data => data.password === data.confirmPassword,
    message: "Пароли не совпадают",
  },
);

export type TResetPasswordForm = z.infer<
  typeof resetPasswordFormValidationSchema
>;
