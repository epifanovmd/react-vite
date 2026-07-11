import { useAuthStore } from "@auth/store";
import { AuthFormCard } from "@components/layouts";
import { Alert, AsyncButton, InputFormField } from "@components/ui";
import { useHotkeys } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { FormProvider } from "react-hook-form";

import { TSignInForm } from "../validations";
import { PasskeyLogin, TwoFactorPrompt } from "./components";
import { usePasskeyAuth, useSignInVM } from "./hooks";

export const SignIn = observer(() => {
  const auth = useAuthStore();
  const { form, handleLogin } = useSignInVM();
  const passkey = usePasskeyAuth();

  useHotkeys([["Enter", () => handleLogin()]], []);

  const passkeyError = passkey.error ?? (auth.error || null);

  return (
    <AuthFormCard
      title="Вход"
      subtitle="Введите данные для входа в панель управления"
    >
      {passkeyError && (
        <Alert variant="error" className="mb-4">
          {passkeyError}
        </Alert>
      )}

      <FormProvider {...form}>
        <div className="flex flex-col gap-4">
          <InputFormField<TSignInForm>
            name="login"
            label="Email или телефон"
            placeholder="email@example.com"
          />
          <InputFormField<TSignInForm>
            name="password"
            label="Пароль"
            type="password"
            placeholder="••••••••"
          />

          <div className="flex justify-end">
            <Link
              className="text-sm text-brand hover:underline"
              to="/forgot-password"
            >
              Забыли пароль?
            </Link>
          </div>

          {auth.isTwoFactorRequired ? (
            <TwoFactorPrompt
              hint={auth.twoFactorHint}
              onVerify={() => auth.verify2FA(form.getValues("password"))}
            />
          ) : (
            <AsyncButton
              type="button"
              className="w-full"
              loading={auth.isLoading}
              onClick={handleLogin}
            >
              Войти
            </AsyncButton>
          )}

          {!auth.isTwoFactorRequired && passkey.support && passkey.profileId && (
            <PasskeyLogin loading={passkey.loading} onLogin={passkey.handleLogin} />
          )}
        </div>
      </FormProvider>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Нет аккаунта?{" "}
        <Link className="text-brand hover:underline" to="/sign-up">
          Зарегистрироваться
        </Link>
      </p>
    </AuthFormCard>
  );
});
