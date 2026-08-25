import { z } from "zod";

export type CheckUsernameAvailability = (username: string) => Promise<boolean>;

export const createAsyncFormSchema = (
  checkUsernameAvailability: CheckUsernameAvailability,
) =>
  z.object({
    username: z
      .string()
      .min(3, { message: "Минимум 3 символа", abort: true })
      .regex(/^[a-z0-9]+$/i, {
        message: "Только латинские буквы и цифры",
        abort: true,
      })
      .refine(checkUsernameAvailability, "Имя уже занято"),
  });

const checkUsernameAvailability: CheckUsernameAvailability = async username => {
  await new Promise(resolve => window.setTimeout(resolve, 500));

  return username.toLowerCase() !== "admin";
};

export const asyncFormSchema = createAsyncFormSchema(checkUsernameAvailability);

export type AsyncFormValues = z.input<typeof asyncFormSchema>;
