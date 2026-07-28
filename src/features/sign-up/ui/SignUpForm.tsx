import { IAuthStore } from "@entities/auth";
import { useHotkeys } from "@mantine/hooks";
import { AuthFormCard, Button, InputFormField } from "@shared/ui";
import { Link } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { FormProvider } from "react-hook-form";

import { useSignUpVM } from "../model/useSignUpVM";
import { TSignUpForm } from "../model/validation";

export const SignUpForm = observer(() => {
  const auth = IAuthStore.useInstance();
  const { form, handleSignUp } = useSignUpVM();

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
        <Link className="text-brand hover:underline" to="/sign-in">
          Войти
        </Link>
      </p>
    </AuthFormCard>
  );
});
