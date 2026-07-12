import { isEmail, isPhone } from "@utils";
import { z } from "zod";

export const loginValidation = z
  .string({ message: "Введите email или номер телефона." })
  .refine(value => isEmail(value) || isPhone(value), {
    message: "Введите корректный email или номер телефона",
  });

export const passwordValidation = z
  .string({ message: "Введите пароль." })
  .min(6, { message: "Пароль должен быть не менее 6-ти символов." });

export const signInFormValidationSchema = z.object({
  login: loginValidation,
  password: passwordValidation,
});

export const signUpFormValidationSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    confirmPassword: passwordValidation,
  })
  .merge(signInFormValidationSchema)
  .refine(data => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают.",
  });

export const forgotPasswordFormValidationSchema = z.object({
  login: z.string().min(1, "Email или телефон обязателен"),
});

export type TSignInForm = z.infer<typeof signInFormValidationSchema>;
export type TSignUpForm = z.infer<typeof signUpFormValidationSchema>;
export type TForgotPasswordForm = z.infer<
  typeof forgotPasswordFormValidationSchema
>;
