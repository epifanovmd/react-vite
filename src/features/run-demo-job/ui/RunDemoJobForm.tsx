import { Button, Form, InputFormField, SwitchFormField } from "@shared/ui";
import { Play } from "lucide-react";
import { FC } from "react";

import { TDemoJobForm, useRunDemoJobVM } from "../model/useRunDemoJobVM";

export const RunDemoJobForm: FC = () => {
  const { form, submit } = useRunDemoJobVM();

  return (
    <Form form={form} onSubmit={submit} className="flex flex-col gap-4">
      <InputFormField<TDemoJobForm> name="text" label="Текст для воркера" />
      <SwitchFormField<TDemoJobForm>
        name="withOutput"
        label="Сохранить результат файлом"
      />
      <Button
        type="submit"
        className="self-start"
        leftIcon={<Play size={15} />}
        loading={form.formState.isSubmitting}
      >
        Запустить
      </Button>
    </Form>
  );
};
