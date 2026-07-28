import { Alert, AuthFormCard, Button, InputFormField } from "@shared/ui";
import { FC } from "react";
import { FormProvider } from "react-hook-form";

import { useResetPasswordVM } from "../model/useResetPasswordVM";
import { TResetPasswordForm } from "../model/validation";

interface ResetPasswordFormProps {
  token: string;
  onSuccess: () => void;
}

export const ResetPasswordForm: FC<ResetPasswordFormProps> = ({
  token,
  onSuccess,
}) => {
  const { form, submit, loading, error } = useResetPasswordVM({
    token,
    onSuccess,
  });

  return (
    <AuthFormCard title="Сброс пароля" subtitle="Введите новый пароль">
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      <FormProvider {...form}>
        <div className="flex flex-col gap-4">
          <InputFormField<TResetPasswordForm>
            name="password"
            label="Новый пароль"
            type="password"
            placeholder="••••••••"
          />
          <InputFormField<TResetPasswordForm>
            name="confirmPassword"
            label="Подтвердите пароль"
            type="password"
            placeholder="••••••••"
          />
          <Button
            type="button"
            className="w-full"
            loading={loading}
            onClick={submit}
          >
            Установить пароль
          </Button>
        </div>
      </FormProvider>
    </AuthFormCard>
  );
};
