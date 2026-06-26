import { AuthFormCard } from "@components/layouts";
import { Button, InputFormField } from "@components/ui";
import { observer } from "mobx-react-lite";
import { FormProvider } from "react-hook-form";

import { TForgotPasswordForm } from "../validations";
import { ForgotPasswordSuccess } from "./components";
import { useForgotPasswordVM } from "./hooks";

export const ForgotPassword = observer(() => {
  const { form, submit, onBack, loading, sent } = useForgotPasswordVM();

  return (
    <AuthFormCard
      title={sent ? undefined : "Восстановление пароля"}
      subtitle={
        sent ? undefined : "Введите email или телефон для получения ссылки сброса"
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
});
