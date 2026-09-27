import { Card, Form, FormSubmit, useZodForm } from "@shared/ui";
import { useState } from "react";

import {
  type FieldArrayFormValues,
  fieldArraySchema,
} from "./field-array-schema";
import { FieldArrayFields } from "./FieldArrayFields";
import { FormExampleLayout } from "./FormExampleLayout";

export const FieldArrayExample = () => {
  const [result, setResult] = useState<FieldArrayFormValues>();
  const form = useZodForm(fieldArraySchema, {
    defaultValues: { contacts: [{ label: "Email", value: "" }] },
  });

  return (
    <Card
      title="Динамический массив"
      description="Типизированные вложенные paths, добавление и удаление строк"
    >
      <Form
        form={form}
        onSubmit={values => setResult(values)}
        className="min-w-0"
      >
        <FormExampleLayout submittedValues={result}>
          <FieldArrayFields />
          <FormSubmit>Сохранить контакты</FormSubmit>
        </FormExampleLayout>
      </Form>
    </Card>
  );
};
