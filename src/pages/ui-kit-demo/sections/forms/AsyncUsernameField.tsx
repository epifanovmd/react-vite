import { InputFormField, useIsFieldValidating } from "@shared/ui";

import type { AsyncFormValues } from "./async-form-schema";

export const AsyncUsernameField = () => {
  const isValidating = useIsFieldValidating<AsyncFormValues, "username">(
    "username",
  );

  return (
    <InputFormField<AsyncFormValues>
      name="username"
      label="Username"
      description="Введите admin, чтобы увидеть ошибку async Zod refine"
      loading={isValidating}
      clearable
      required
    />
  );
};
