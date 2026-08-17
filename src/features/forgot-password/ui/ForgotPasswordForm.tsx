import { AuthFormCard, Button, InputFormField } from "@shared/ui";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { FormProvider } from "react-hook-form";

import { useForgotPasswordVM } from "../model/useForgotPasswordVM";
import { TForgotPasswordForm } from "../model/validation";
import { ForgotPasswordSuccess } from "./ForgotPasswordSuccess";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export const ForgotPasswordForm: FC<ForgotPasswordFormProps> = observer(
  ({ onBack }) => {
    const { form, submit, loading, sent } = useForgotPasswordVM();

    return (
      <AuthFormCard
        title={sent ? undefined : "Восстановление пароля"}
        subtitle={
          sent
            ? undefined
            : "Введите email или телефон для получения ссылки сброса"
        }
      >
        {sent ? (
          <ForgotPasswordSuccess onBack={onBack} />
        ) : (
          <FormProvider {...form}>
            <div className="flex flex-col gap-4">
              <InputFormField<TForgotPasswordForm>
                name="login"
                label="Email или телефон"
                placeholder="email@example.com"
              />
              <Button
                type="button"
                loading={loading}
                className="w-full"
                onClick={submit}
              >
                Отправить ссылку
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="w-full"
              >
                Вернуться к входу
              </Button>
            </div>
          </FormProvider>
        )}
      </AuthFormCard>
    );
  },
);
