import { Card, Form, FormSubmit, useZodForm } from "@shared/ui";
import { useState } from "react";

import { asyncFormSchema, type AsyncFormValues } from "./async-form-schema";
import { AsyncUsernameField } from "./AsyncUsernameField";
import { FormExampleLayout } from "./FormExampleLayout";

export const AsyncValidationExample = () => {
  const [result, setResult] = useState<AsyncFormValues>();
  const form = useZodForm(asyncFormSchema, {
    defaultValues: { username: "" },
  });

  return (
    <Card
      title="Async validation"
      description="Асинхронная проверка является частью Zod-схемы"
    >
      <Form
        form={form}
        onSubmit={values => setResult(values)}
        className="min-w-0"
      >
        <FormExampleLayout submittedValues={result}>
          <AsyncUsernameField />
          <FormSubmit>Проверить</FormSubmit>
        </FormExampleLayout>
      </Form>
    </Card>
  );
};
