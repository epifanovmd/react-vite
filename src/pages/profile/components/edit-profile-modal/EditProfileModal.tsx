import {
  AsyncButton,
  Button,
  DatePickerFormField,
  InputFormField,
  Modal,
  ModalContent,
} from "@components/ui";
import { FC } from "react";
import { FormProvider } from "react-hook-form";

import { EditProfileModalProps } from "./EditProfileModal.types";
import { useEditProfileVM } from "./useEditProfileVM";
import { TProfileForm } from "./validations";

export const EditProfileModal: FC<EditProfileModalProps> = ({
  open,
  onClose,
}) => {
  const { form, submit } = useEditProfileVM({ open, onSuccess: onClose });

  return (
    <Modal open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <ModalContent
        size="md"
        title="Редактирование профиля"
        description="Обновите личные данные профиля"
        footer={
          <>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <AsyncButton onClick={() => submit()}>Сохранить</AsyncButton>
          </>
        }
      >
        <FormProvider {...form}>
          <form onSubmit={submit} className="flex flex-col gap-4 py-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputFormField<TProfileForm>
                name="firstName"
                label="Имя"
                placeholder="Иван"
              />
              <InputFormField<TProfileForm>
                name="lastName"
                label="Фамилия"
                placeholder="Иванов"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputFormField<TProfileForm>
                name="gender"
                label="Пол"
                placeholder="Мужской / Женский"
              />
              <DatePickerFormField<TProfileForm>
                name="birthDate"
                label="Дата рождения"
                placeholder="Выберите дату"
                clearable
              />
            </div>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
};
