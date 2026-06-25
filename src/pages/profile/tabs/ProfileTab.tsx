import {
  AsyncButton,
  Button,
  Card,
  DatePickerFormField,
  InputFormField,
} from "@components/ui";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { FormProvider } from "react-hook-form";

import { ProfileFormData, useProfileVM } from "../hooks/useProfileVM";

export const ProfileTab: FC = observer(() => {
  const {
    model,
    sendingVerification,
    methods,
    onSubmit,
    sendEmailVerification,
  } = useProfileVM();

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-3 sm:gap-6">
        <Card title="Личные данные" className="p-5">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputFormField<ProfileFormData>
                name="firstName"
                label="Имя"
                placeholder="Иван"
              />
              <InputFormField<ProfileFormData>
                name="lastName"
                label="Фамилия"
                placeholder="Иванов"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputFormField<ProfileFormData>
                name="gender"
                label="Пол"
                placeholder="Мужской / Женский"
              />
              <DatePickerFormField<ProfileFormData>
                name="birthDate"
                label="Дата рождения"
                placeholder="Выберите дату"
                clearable
              />
            </div>
          </div>
        </Card>

        <Card title="Учётная запись" className="p-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4 py-1">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm text-foreground">
                  {model?.email ?? "—"}
                </span>
              </div>
              {model?.email && !model.emailVerified && (
                <Button
                  size="sm"
                  variant="outline"
                  loading={sendingVerification}
                  onClick={sendEmailVerification}
                >
                  Подтвердить email
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-muted-foreground">Телефон</span>
              <span className="text-sm text-foreground">
                {model?.phone ?? "—"}
              </span>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <AsyncButton onClick={onSubmit}>Сохранить</AsyncButton>
        </div>
      </div>
    </FormProvider>
  );
});
