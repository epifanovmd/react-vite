import { AsyncButton, FieldWrapper, Input } from "@components";
import { typedFormField } from "@force-dev/react";
import { FC, memo, PropsWithChildren } from "react";
import { FormProvider } from "react-hook-form";

import { useResetPassword } from "./hooks";
import { TResetPasswordForm } from "./validations";

export type IResetPasswordProps = object;

const Field = typedFormField<TResetPasswordForm>();

export const ResetPassword: FC<PropsWithChildren<IResetPasswordProps>> = memo(
  () => {
    const { form, handleSubmit } = useResetPassword();

    return (
      <div className="flex items-center justify-center flex-col h-screen">
        <FormProvider {...form}>
          <form className="w-full max-w-[500px] p-8 rounded-2xl shadow-lg shadow-gray-400/20">
            <div className="flex justify-between">
              <div className="text-xl mb-4">Введите новый пароль</div>
            </div>

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
                    name="confirmPassword"
                    status={invalid ? "error" : undefined}
                    className="mt-2"
                    placeholder="Подтверждение пароля"
                    value={value}
                    onChange={onChange}
                    type="password"
                    autoComplete="new-password"
                  />
                </FieldWrapper>
              )}
            />

            <div className="flex justify-between mt-4">
              <AsyncButton onClick={handleSubmit}>Сохранить</AsyncButton>
            </div>
          </form>
        </FormProvider>
      </div>
    );
  },
);
