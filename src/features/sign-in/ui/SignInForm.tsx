import { IAuthStore } from "@entities/auth";
import { useHotkeys } from "@mantine/hooks";
import { Alert, AsyncButton, AuthFormCard, InputFormField } from "@shared/ui";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { FormProvider } from "react-hook-form";

import { usePasskeyAuth } from "../model/usePasskeyAuth";
import { useSignInVM } from "../model/useSignInVM";
import { TSignInForm } from "../model/validation";
import { PasskeyLogin } from "./PasskeyLogin";
import { TwoFactorPrompt } from "./TwoFactorPrompt";

interface SignInFormProps {
  onSuccess: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export const SignInForm: FC<SignInFormProps> = observer(
  ({ onSuccess, onForgotPassword, onSignUp }) => {
    const auth = IAuthStore.useInstance();
    const { form, handleLogin } = useSignInVM(onSuccess);
    const passkey = usePasskeyAuth(onSuccess);

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
              <button
                type="button"
                className="text-sm text-brand hover:underline"
                onClick={onForgotPassword}
              >
                Забыли пароль?
              </button>
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

            {!auth.isTwoFactorRequired &&
              passkey.support &&
              passkey.profileId && (
                <PasskeyLogin
                  loading={passkey.loading}
                  onLogin={passkey.handleLogin}
                />
              )}
          </div>
        </FormProvider>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Нет аккаунта?{" "}
          <button
            type="button"
            className="text-brand hover:underline"
            onClick={onSignUp}
          >
            Зарегистрироваться
          </button>
        </p>
      </AuthFormCard>
    );
  },
);
