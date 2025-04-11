import { AsyncButton, FieldWrapper, Input } from "@components";
import { typedFormField } from "@force-dev/react";
import { FC, memo, PropsWithChildren } from "react";
import { FormProvider } from "react-hook-form";

import { useRecoveryPassword } from "./hooks/useRecoveryPassword";
import { TRecoveryPasswordForm } from "./validations";

export type IRecoveryPasswordProps = object;

const Field = typedFormField<TRecoveryPasswordForm>();

export const RecoveryPassword: FC<PropsWithChildren<IRecoveryPasswordProps>> =
  memo(() => {
    const { form, handleSubmit } = useRecoveryPassword();

    return (
      <div className="flex items-center justify-center flex-col h-screen">
        <FormProvider {...form}>
          <form
            className="w-full max-w-[500px] p-8 rounded-2xl shadow-lg"
            style={{ boxShadow: "3px 4px 18px 0 rgba(34, 60, 80, 0.2)" }}
          >
            <div className="flex justify-between">
              <div className="text-xl mb-4">Восстановление пароля</div>
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
                    placeholder="Введите ваш Email для восстановления пароля"
                    value={value}
                    onChange={onChange}
                    type="email"
                    autoComplete="email"
                  />
                </FieldWrapper>
              )}
            />
            <div className="flex justify-between mt-4">
              <AsyncButton onClick={handleSubmit}>Восстановить</AsyncButton>
            </div>
          </form>
        </FormProvider>
      </div>
    );
  });
