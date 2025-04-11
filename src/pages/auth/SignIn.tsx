import { usePasskeyAuth } from "@common";
import { AsyncButton, Input } from "@components";
import { FieldWrapper } from "@components/ui/form/field";
import { typedFormField } from "@force-dev/react";
import { observer } from "mobx-react-lite";
import { FormProvider } from "react-hook-form";

import { useSignInVM } from "./hooks";
import { TSignInForm } from "./validations";

const Field = typedFormField<TSignInForm>();

export const SignInPage = observer(() => {
  const {
    form,
    handleLogin,
    handleNavigateSignUp,
    handleNavigateRecoveryPassword,
  } = useSignInVM();
  const { profileId, support, handleLogin: handlePasskey } = usePasskeyAuth();

  return (
    <div className="flex items-center justify-center flex-col h-screen">
      <FormProvider {...form}>
        <form className="w-full max-w-[500px] p-8 rounded-2xl shadow-lg shadow-gray-400/20">
          <div className="flex justify-between">
            <div className="text-xl mb-4">Авторизация</div>
            {support && profileId && (
              <AsyncButton type="primary" onClick={handlePasskey}>
                Passkey
              </AsyncButton>
            )}
          </div>

          <Field
            name="login"
            render={({
              field: { onChange, value },
              fieldState: { invalid, error },
            }) => (
              <FieldWrapper error={error}>
                <Input
                  name="login"
                  status={invalid ? "error" : undefined}
                  className="mt-2"
                  placeholder="Login"
                  value={value}
                  onChange={onChange}
                  autoComplete="login"
                />
              </FieldWrapper>
            )}
          />

          <Field
            name="password"
            render={({
              field: { onChange, value },
              fieldState: { invalid, error },
            }) => (
              <FieldWrapper error={error}>
                <Input.Password
                  name="password"
                  status={invalid ? "error" : undefined}
                  className="mt-2"
                  placeholder="Пароль"
                  value={value}
                  onChange={onChange}
                  type="password"
                  autoComplete="current-password"
                />
              </FieldWrapper>
            )}
          />

          <div className="flex justify-between mt-4">
            <div className="flex">
              <AsyncButton onClick={handleLogin}>Войти</AsyncButton>
              <AsyncButton type="link" onClick={handleNavigateRecoveryPassword}>
                Забыли пароль?
              </AsyncButton>
            </div>
            <AsyncButton type="link" onClick={handleNavigateSignUp}>
              Регистрация
            </AsyncButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
});
