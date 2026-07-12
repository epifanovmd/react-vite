import { AuthFormCard } from "@components/layouts";
import { Alert, Button, InputFormField } from "@components/ui";
import { FC } from "react";
import { FormProvider } from "react-hook-form";

import { useResetPasswordVM } from "./hooks";
import { TResetPasswordForm } from "./validations";

interface ResetPasswordProps {
  token: string;
  onSuccess: () => void;
}

export const ResetPassword: FC<ResetPasswordProps> = ({ token, onSuccess }) => {
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
