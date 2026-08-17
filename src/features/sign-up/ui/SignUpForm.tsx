import { IAuthStore } from "@entities/auth";
import { useHotkeys } from "@mantine/hooks";
import { AuthFormCard, Button, InputFormField } from "@shared/ui";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { FormProvider } from "react-hook-form";

import { useSignUpVM } from "../model/useSignUpVM";
import { TSignUpForm } from "../model/validation";

interface SignUpFormProps {
  onSuccess: () => void;
  onSignIn: () => void;
}

export const SignUpForm: FC<SignUpFormProps> = observer(
  ({ onSuccess, onSignIn }) => {
    const auth = IAuthStore.useInstance();
    const { form, handleSignUp } = useSignUpVM(onSuccess);

    useHotkeys([["Enter", () => handleSignUp()]], []);

    return (
      <AuthFormCard
        title="Создать аккаунт"
        subtitle="Заполните данные для регистрации"
      >
        <FormProvider {...form}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <InputFormField<TSignUpForm> name="firstName" label="Имя" />
              <InputFormField<TSignUpForm> name="lastName" label="Фамилия" />
            </div>
            <InputFormField<TSignUpForm>
              name="login"
              label="Логин / Email"
              type="email"
              required
            />
            <InputFormField<TSignUpForm>
              name="password"
              label="Пароль"
              type="password"
              required
            />
            <InputFormField<TSignUpForm>
              name="confirmPassword"
              label="Подтверждение пароля"
              type="password"
              required
            />
            <Button
              type="button"
              loading={auth.isLoading}
              className="w-full"
              onClick={handleSignUp}
            >
              Создать аккаунт
            </Button>
          </div>
        </FormProvider>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{" "}
          <button
            type="button"
            className="text-brand hover:underline"
            onClick={onSignIn}
          >
            Войти
          </button>
        </p>
      </AuthFormCard>
    );
  },
);
