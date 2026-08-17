import {
  Card,
  DatePickerFormField,
  DateRangePickerFormField,
  Form,
  FormSubmit,
  MaskedDatePickerFormField,
  MaskedDateRangePickerFormField,
  useZodForm,
} from "@shared/ui";
import { useState } from "react";
import { z } from "zod";

import { FormExampleLayout } from "./FormExampleLayout";

const dateRangeSchema = z
  .object({ from: z.date().optional(), to: z.date().optional() })
  .optional();

const dateFieldsSchema = z.object({
  birthDate: z.date().optional(),
  period: dateRangeSchema,
  documentDate: z.date().optional(),
  documentPeriod: dateRangeSchema,
});

type DateFieldsValues = z.input<typeof dateFieldsSchema>;

export const DateFieldsFormExample = () => {
  const [result, setResult] = useState<DateFieldsValues>();
  const form = useZodForm(dateFieldsSchema, { defaultValues: {} });

  return (
    <Card
      title="Поля дат"
      description="Одиночные даты и диапазоны с обычным и маскированным вводом"
    >
      <Form
        form={form}
        onSubmit={values => setResult(values)}
        className="min-w-0"
      >
        <FormExampleLayout submittedValues={result}>
          <DatePickerFormField<DateFieldsValues>
            name="birthDate"
            label="Дата рождения"
            clearable
          />
          <DateRangePickerFormField<DateFieldsValues>
            name="period"
            label="Период"
            clearable
          />
          <MaskedDatePickerFormField<DateFieldsValues>
            name="documentDate"
            label="Дата документа"
            clearable
          />
          <MaskedDateRangePickerFormField<DateFieldsValues>
            name="documentPeriod"
            label="Срок действия"
            clearable
          />
          <FormSubmit>Отправить</FormSubmit>
        </FormExampleLayout>
      </Form>
    </Card>
  );
};
