import { Card, Form, FormSubmit, useZodForm } from "@shared/ui";
import { useState } from "react";

import {
  dynamicFormSchema,
  type DynamicFormValues,
} from "./dynamic-form-schema";
import { DynamicFormFields } from "./DynamicFormFields";
import { FormExampleLayout } from "./FormExampleLayout";

export const DynamicFormExample = () => {
  const [result, setResult] = useState<DynamicFormValues>();
  const form = useZodForm(dynamicFormSchema, {
    defaultValues: {
      customerType: "person",
      country: "RU",
      inn: "",
      delivery: "pickup",
      address: "",
    },
  });

  return (
    <Card
      title="Динамическая обязательность"
      description="Одна predicate используется UI и superRefine; скрытые значения имеют явную политику"
    >
      <Form
        form={form}
        onSubmit={values => setResult(values)}
        className="min-w-0"
      >
        <FormExampleLayout submittedValues={result}>
          <DynamicFormFields />
          <FormSubmit>Отправить динамическую форму</FormSubmit>
        </FormExampleLayout>
      </Form>
    </Card>
  );
};
