import { InputFormField } from "@components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHotkeys } from "@mantine/hooks";
import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { CreateUserFormData, createUserSchema } from "./schema";

export type { CreateUserFormData };

interface CreateUserFormProps {
  onSubmit: (
    data: CreateUserFormData,
  ) => Promise<void>;
}

export const CreateUserForm: FC<CreateUserFormProps> = ({ onSubmit }) => {
  const methods = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const { handleSubmit, watch } = methods;

  const handleFormSubmit = async (data: CreateUserFormData) => {
    await onSubmit(data);
  };

  useHotkeys([["Enter", () => handleSubmit(handleFormSubmit)()]], ["SELECT"]);

  return (
    <FormProvider {...methods}>
      <form
        id="create-user-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-4 my-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <InputFormField<CreateUserFormData> name="firstName" label="Имя" />
          <InputFormField<CreateUserFormData> name="lastName" label="Фамилия" />
        </div>
        <InputFormField<CreateUserFormData>
          name="email"
          label="Email"
          type="email"
          placeholder="user@example.com"
        />
        <InputFormField<CreateUserFormData>
          name="phone"
          label="Телефон"
          placeholder="+1234567890"
        />
        <InputFormField<CreateUserFormData>
          name="password"
          label="Пароль"
          type="password"
          required
        />
      </form>
    </FormProvider>
  );
};
