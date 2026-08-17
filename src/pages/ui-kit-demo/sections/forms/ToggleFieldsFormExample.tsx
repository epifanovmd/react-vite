import {
  Card,
  CheckboxFormField,
  Form,
  FormSubmit,
  Radio,
  RadioFormField,
  SegmentedFormField,
  SwitchFormField,
  useZodForm,
} from "@shared/ui";
import { useState } from "react";
import { z } from "zod";

import { FormExampleLayout } from "./FormExampleLayout";

const toggleFieldsSchema = z.object({
  view: z.enum(["compact", "comfortable"]),
  plan: z.enum(["free", "pro"]),
  active: z.boolean(),
  accepted: z.boolean().refine(Boolean, "Нужно принять условия"),
});

type ToggleFieldsValues = z.input<typeof toggleFieldsSchema>;

export const ToggleFieldsFormExample = () => {
  const [result, setResult] = useState<ToggleFieldsValues>();
  const form = useZodForm(toggleFieldsSchema, {
    defaultValues: {
      view: "compact",
      plan: "free",
      active: true,
      accepted: false,
    },
  });

  return (
    <Card
      title="Переключатели"
      description="Segmented, radio, switch и обязательный checkbox"
    >
      <Form
        form={form}
        onSubmit={values => setResult(values)}
        className="min-w-0"
      >
        <FormExampleLayout submittedValues={result}>
          <SegmentedFormField<ToggleFieldsValues>
            name="view"
            label="Плотность интерфейса"
            options={[
              { value: "compact", label: "Компактно" },
              { value: "comfortable", label: "Свободно" },
            ]}
          />
          <RadioFormField<ToggleFieldsValues> name="plan" label="Тариф">
            <Radio value="free" label="Free" />
            <Radio value="pro" label="Pro" />
          </RadioFormField>
          <SwitchFormField<ToggleFieldsValues>
            name="active"
            label="Активный профиль"
          />
          <CheckboxFormField<ToggleFieldsValues>
            name="accepted"
            label="Условия использования"
            required
          />
          <FormSubmit>Отправить</FormSubmit>
        </FormExampleLayout>
      </Form>
    </Card>
  );
};
