import { InputFormField, useAsyncFieldValidation } from "@shared/ui";

import type { AsyncFormValues } from "./async-form-schema";

const checkUsername = async (
  username: string,
  signal: AbortSignal,
): Promise<string | undefined> => {
  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, 500);

    signal.addEventListener("abort", () => {
      window.clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

  return username.toLowerCase() === "admin"
    ? "Имя admin уже занято"
    : undefined;
};

const shouldValidateUsername = (username: string): boolean =>
  username.length >= 3;

export const AsyncUsernameField = () => {
  const { isValidating } = useAsyncFieldValidation<AsyncFormValues, "username">(
    {
      name: "username",
      validate: checkUsername,
      shouldValidate: shouldValidateUsername,
    },
  );

  return (
    <InputFormField<AsyncFormValues>
      name="username"
      label="Username"
      description="Введите admin, чтобы увидеть серверную ошибку"
      loading={isValidating}
      clearable
      required
    />
  );
};
