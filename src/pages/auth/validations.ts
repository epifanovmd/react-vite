import { loginValidation, passwordValidation } from "@common";
import { z } from "zod";

export const recoveryPasswordValidationSchema = z.object({
  login: loginValidation,
});

export const signInFormValidationSchema = z.object({
  login: loginValidation,
  password: passwordValidation,
});

export const signUpFormValidationSchema = z
  .object({
    confirmPassword: passwordValidation,
  })
  .merge(signInFormValidationSchema)
  .refine(data => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают.",
  });

export type TRecoveryPasswordForm = z.infer<
  typeof recoveryPasswordValidationSchema
>;
export type TSignInForm = z.infer<typeof signInFormValidationSchema>;
export type TSignUpForm = z.infer<typeof signUpFormValidationSchema>;
