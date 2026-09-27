import {
  AutocompleteFormField,
  Card,
  Form,
  FormSubmit,
  MultiSelectFormField,
  SelectFormField,
  useZodForm,
} from "@shared/ui";
import { useState } from "react";
import { z } from "zod";

import { FormExampleLayout } from "./FormExampleLayout";

const choiceFieldsSchema = z.object({
  country: z.string().min(1, "Выберите страну"),
  roles: z.array(z.string()).min(1, "Выберите хотя бы одну роль"),
  city: z.string(),
});

type ChoiceFieldsValues = z.input<typeof choiceFieldsSchema>;

const countryOptions = [
  { value: "RU", label: "Россия" },
  { value: "KZ", label: "Казахстан" },
  { value: "AM", label: "Армения" },
];

const roleOptions = [
  { value: "admin", label: "Администратор" },
  { value: "editor", label: "Редактор" },
  { value: "viewer", label: "Наблюдатель" },
];

const cityOptions = [
  { value: "Москва", label: "Москва" },
  { value: "Казань", label: "Казань" },
  { value: "Ереван", label: "Ереван" },
];

export const ChoiceFieldsFormExample = () => {
  const [result, setResult] = useState<ChoiceFieldsValues>();
  const form = useZodForm(choiceFieldsSchema, {
    defaultValues: { country: "", roles: [], city: "" },
  });

  return (
    <Card
      title="Поля выбора"
      description="Select, множественный выбор и autocomplete"
    >
      <Form
        form={form}
        onSubmit={values => setResult(values)}
        className="min-w-0"
      >
        <FormExampleLayout submittedValues={result}>
          <SelectFormField<ChoiceFieldsValues>
            name="country"
            label="Страна"
            options={countryOptions}
            search
            required
          />
          <MultiSelectFormField<ChoiceFieldsValues>
            name="roles"
            label="Роли"
            options={roleOptions}
            search
            clearable
            required
          />
          <AutocompleteFormField<ChoiceFieldsValues>
            name="city"
            label="Город"
            options={cityOptions}
          />
          <FormSubmit>Отправить</FormSubmit>
        </FormExampleLayout>
      </Form>
    </Card>
  );
};
