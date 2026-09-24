import {
  Card,
  Form,
  FormSubmit,
  InputFormField,
  MaskedInputFormField,
  NumberInputFormField,
  OtpInputFormField,
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
  age: z
    .number()
    .nullable()
    .refine(age => age !== null && age >= 18, "Укажите возраст от 18 лет"),
  code: z.string().length(4, "Введите код из 4 цифр"),
});

type TextFieldsValues = z.input<typeof textFieldsSchema>;

export const TextFieldsFormExample = () => {
  const [result, setResult] = useState<TextFieldsValues>();
  const form = useZodForm(textFieldsSchema, {
    defaultValues: { name: "", phone: "", bio: "", age: null, code: "" },
  });

  return (
    <Card
      title="Текстовые поля"
      description="Обычный, маскированный, многострочный, числовой ввод и код подтверждения"
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
            placeholder="Введите имя"
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
          <NumberInputFormField<TextFieldsValues>
            name="age"
            label="Возраст"
            min={0}
            max={120}
            precision={0}
            allowNegative={false}
            suffix="лет"
            required
          />
          <OtpInputFormField<TextFieldsValues>
            name="code"
            label="Код из SMS"
            description="Можно вставить код целиком"
            length={4}
            required
          />
          <FormSubmit>Отправить</FormSubmit>
        </FormExampleLayout>
      </Form>
    </Card>
  );
};
