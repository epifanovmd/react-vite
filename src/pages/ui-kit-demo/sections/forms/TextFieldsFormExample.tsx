import {
  Card,
  Form,
  FormSubmit,
  InputFormField,
  MaskedInputFormField,
  phoneMask,
  TextareaFormField,
  useZodForm,
} from "@shared/ui";
import { useState } from "react";
import { z } from "zod";

import { FormExampleLayout } from "./FormExampleLayout";

const textFieldsSchema = z.object({
  name: z.string().min(2, "Введите минимум 2 символа"),
  phone: z.string().min(11, "Введите телефон полностью"),
  bio: z.string().max(120, "Максимум 120 символов").optional(),
});

type TextFieldsValues = z.input<typeof textFieldsSchema>;

export const TextFieldsFormExample = () => {
  const [result, setResult] = useState<TextFieldsValues>();
  const form = useZodForm(textFieldsSchema, {
    defaultValues: { name: "", phone: "", bio: "" },
  });

  return (
    <Card
      title="Текстовые поля"
      description="Обычный, маскированный и многострочный ввод"
    >
      <Form
        form={form}
        onSubmit={values => setResult(values)}
        className="min-w-0"
      >
        <FormExampleLayout submittedValues={result}>
          <InputFormField<TextFieldsValues>
            name="name"
            label="Имя"
            labelPlacement="floating"
            clearable
            required
          />
          <MaskedInputFormField<TextFieldsValues>
            name="phone"
            label="Телефон"
            mask={phoneMask}
            placeholder="+7 (___) ___-__-__"
            clearable
            required
          />
          <TextareaFormField<TextFieldsValues>
            name="bio"
            label="О себе"
            showCount
            maxLength={120}
          />
          <FormSubmit>Отправить</FormSubmit>
        </FormExampleLayout>
      </Form>
    </Card>
  );
};
