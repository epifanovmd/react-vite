import { AsyncButton, Button, Card, InputFormField } from "@components/ui";
import { usePasskeyAuth } from "@core/auth";
import { useHotkeys } from "@mantine/hooks";
import { useAuthStore } from "@store";
import { Link } from "@tanstack/react-router";
import { Fingerprint } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FormProvider } from "react-hook-form";

import { useSignInVM } from "./hooks";
import { TSignInForm } from "./validations";

export const SignIn = observer(() => {
  const auth = useAuthStore();
  const { form, handleLogin } = useSignInVM();
  const passkey = usePasskeyAuth();

  useHotkeys([["Enter", () => handleLogin()]], []);

  const passkeyError = passkey.error ?? (auth.error || null);

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Вход</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Введите данные для входа в панель управления
        </p>
      </div>

      {passkeyError && (
        <div className="mb-4 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{passkeyError}</p>
        </div>
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
              to={"/forgot-password"}
            >
              Забыли пароль?
            </Link>
          </div>

          {auth.isTwoFactorRequired ? (
            <div className="flex flex-col gap-3 rounded-lg border border-brand/20 bg-brand/5 p-4">
              <p className="text-sm text-foreground">
                Требуется подтверждение второго фактора.
                {auth.twoFactorHint ? ` ${auth.twoFactorHint}` : ""}
              </p>
              <AsyncButton
                type="button"
                className="w-full"
                onClick={() => auth.verify2FA(form.getValues("password"))}
              >
                Подтвердить вход
              </AsyncButton>
            </div>
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
              <>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">или</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  loading={passkey.loading}
                  onClick={passkey.handleLogin}
                >
                  <Fingerprint size={16} />
                  Войти с passkey
                </Button>
              </>
            )}
        </div>
      </FormProvider>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Нет аккаунта?{" "}
        <Link className="text-brand hover:underline" to="/sign-up">
          Зарегистрироваться
        </Link>
      </p>
    </Card>
  );
});
