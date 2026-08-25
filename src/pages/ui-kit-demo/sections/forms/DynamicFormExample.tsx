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
      hasInn: false,
      needsDelivery: false,
    },
    shouldUnregister: true,
  });

  return (
    <Card
      title="Динамическая обязательность"
      description="Структурные варианты формы через discriminated union и omit"
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
