import {
  applyServerErrors,
  Button,
  Card,
  Form,
  FormError,
  FormSubmit,
  useZodForm,
} from "@shared/ui";
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
      title="Async и server validation"
      description="Debounce, AbortController и нормализованные ошибки API"
    >
      <Form
        form={form}
        onSubmit={async values => {
          await new Promise(resolve => window.setTimeout(resolve, 300));

          if (values.username === "server") {
            applyServerErrors(form.setError, [
              { name: "username", message: "Сервер отклонил это имя" },
              { name: "root", message: "Исправьте ошибки ответа API" },
            ]);

            return;
          }

          setResult(values);
        }}
        className="min-w-0"
      >
        <FormExampleLayout submittedValues={result}>
          <FormError />
          <AsyncUsernameField />
          <div className="flex flex-wrap gap-2">
            <FormSubmit>Проверить</FormSubmit>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                applyServerErrors(form.setError, [
                  { name: "username", message: "Ошибка поля от API" },
                  { name: "root", message: "Общая серверная ошибка" },
                ])
              }
            >
              Имитировать API errors
            </Button>
          </div>
        </FormExampleLayout>
      </Form>
    </Card>
  );
};
