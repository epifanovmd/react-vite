import { Card, Form, FormSubmit, useZodForm } from "@shared/ui";
import { useState } from "react";

import {
  type DynamicFormResult,
  dynamicFormSchema,
  type DynamicFormValues,
} from "./dynamic-form-schema";
import { DynamicFormFields } from "./DynamicFormFields";
import { FormExampleLayout } from "./FormExampleLayout";

export const DynamicFormExample = () => {
  const [result, setResult] = useState<DynamicFormResult>();
  const form = useZodForm(dynamicFormSchema, {
    defaultValues: {
      customerType: "person",
      country: "RU",
      needsDelivery: false,
    },
    shouldUnregister: true,
  });

  return (
    <Card
      title="Динамическая обязательность"
      description="Вложенные discriminated union для комбинации нескольких полей"
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
