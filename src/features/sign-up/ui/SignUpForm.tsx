import { IAuthStore } from "@entities/auth";
import { AuthFormCard, Form, FormSubmit, InputFormField } from "@shared/ui";
import { observer } from "mobx-react-lite";
import { FC } from "react";

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

    return (
      <AuthFormCard
        title="Создать аккаунт"
        subtitle="Заполните данные для регистрации"
      >
        <Form
          form={form}
          onSubmit={handleSignUp}
          className="flex flex-col gap-4"
        >
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
            rules={{ deps: "confirmPassword" }}
            required
          />
          <InputFormField<TSignUpForm>
            name="confirmPassword"
            label="Подтверждение пароля"
            type="password"
            required
          />
          <FormSubmit loading={auth.isLoading} className="w-full">
            Создать аккаунт
          </FormSubmit>
        </Form>

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
