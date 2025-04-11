import { ArrowLeftOutlined } from "@ant-design/icons";
import { AsyncButton, FieldWrapper, Input } from "@components";
import { typedFormField } from "@force-dev/react";
import { useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { FormProvider } from "react-hook-form";

import { useSignUpVM } from "./hooks";
import { TSignUpForm } from "./validations";

const Field = typedFormField<TSignUpForm>();

export const SignUpPage = observer(() => {
  const { form, handleSignUp } = useSignUpVM();
  const navigate = useNavigate();

  const onBack = useCallback(() => {
    navigate({ to: "/auth/signIn" }).then();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center flex-col h-screen">
      <FormProvider {...form}>
        <form className="w-full max-w-[500px] p-8 rounded-2xl shadow-lg shadow-gray-400/20">
          <div className="flex items-center mb-4">
            <ArrowLeftOutlined
              className="p-1 mr-2 cursor-pointer"
              onClick={onBack}
            />
            <div className="text-xl">Регистрация</div>
          </div>

          <Field
            name="login"
            render={({
              field: { onChange, value },
              fieldState: { invalid, error },
            }) => (
              <FieldWrapper error={error}>
                <Input
                  placeholder="Email"
                  status={invalid ? "error" : undefined}
                  className="mt-2"
                  value={value}
                  onChange={onChange}
                  autoComplete="email"
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
                  placeholder="Пароль"
                  type="password"
                  status={invalid ? "error" : undefined}
                  className="mt-2"
                  value={value}
                  onChange={onChange}
                  autoComplete="new-password"
                />
              </FieldWrapper>
            )}
          />

          <Field
            name="confirmPassword"
            render={({
              field: { onChange, value },
              fieldState: { invalid, error },
            }) => (
              <FieldWrapper error={error}>
                <Input.Password
                  placeholder="Подтверждение пароля"
                  type="password"
                  status={invalid ? "error" : undefined}
                  className="mt-2"
                  value={value}
                  onChange={onChange}
                  autoComplete="new-password"
                />
              </FieldWrapper>
            )}
          />

          <div className="flex justify-end mt-4">
            <AsyncButton onClick={handleSignUp}>Зарегистрироваться</AsyncButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
});
