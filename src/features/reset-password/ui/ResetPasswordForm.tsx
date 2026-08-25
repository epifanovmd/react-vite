import {
  Alert,
  AuthFormCard,
  Form,
  FormSubmit,
  InputFormField,
} from "@shared/ui";
import { FC } from "react";

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
  const { form, submit, error } = useResetPasswordVM({
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

      <Form form={form} onSubmit={submit} className="flex flex-col gap-4">
        <InputFormField<TResetPasswordForm>
          name="password"
          label="Новый пароль"
          type="password"
          placeholder="••••••••"
          rules={{ deps: "confirmPassword" }}
        />
        <InputFormField<TResetPasswordForm>
          name="confirmPassword"
          label="Подтвердите пароль"
          type="password"
          placeholder="••••••••"
        />
        <FormSubmit className="w-full">Установить пароль</FormSubmit>
      </Form>
    </AuthFormCard>
  );
};
