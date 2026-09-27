import {
  Card,
  DatePickerFormField,
  DateRangePickerFormField,
  Form,
  FormSubmit,
  MaskedDatePickerFormField,
  MaskedDateRangePickerFormField,
  TimePickerFormField,
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
  meetingAt: z.date().optional(),
  reminderAt: z.date().optional(),
});

type DateFieldsValues = z.input<typeof dateFieldsSchema>;

export const DateFieldsFormExample = () => {
  const [result, setResult] = useState<DateFieldsValues>();
  const form = useZodForm(dateFieldsSchema, { defaultValues: {} });

  return (
    <Card
      title="Поля дат"
      description="Одиночные даты, диапазоны, дата со временем и отдельное время"
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
          <DatePickerFormField<DateFieldsValues>
            name="meetingAt"
            label="Встреча"
            withTime
            timeStep={15}
            clearable
          />
          <TimePickerFormField<DateFieldsValues>
            name="reminderAt"
            label="Время напоминания"
            step={15}
            clearable
          />
          <FormSubmit>Отправить</FormSubmit>
        </FormExampleLayout>
      </Form>
    </Card>
  );
};
