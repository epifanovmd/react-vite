import { InputFormField } from "@shared/ui";
import { useFormContext, useFormState } from "react-hook-form";

import type { AsyncFormValues } from "./async-form-schema";

export const AsyncUsernameField = () => {
  const { control } = useFormContext<AsyncFormValues>();
  const { validatingFields } = useFormState({
    control,
    name: "username",
    exact: true,
  });

  return (
    <InputFormField<AsyncFormValues>
      name="username"
      label="Username"
      description="Введите admin, чтобы увидеть ошибку async Zod refine"
      loading={validatingFields.username}
      clearable
      required
    />
  );
};
