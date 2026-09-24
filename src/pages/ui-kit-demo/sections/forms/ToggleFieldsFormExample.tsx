import {
  Card,
  CheckboxFormField,
  Form,
  FormSubmit,
  Radio,
  RadioFormField,
  SegmentedFormField,
  SliderFormField,
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
  volume: z.number(),
  budget: z
    .array(z.number())
    .refine(
      ([from = 0, to = 0]) => to - from >= 10_000,
      "Диапазон от 10 000 ₽",
    ),
});

type ToggleFieldsValues = z.input<typeof toggleFieldsSchema>;

const BUDGET_MARKS = [
  { value: 0, label: "0" },
  { value: 50_000, label: "50 тыс." },
  { value: 100_000, label: "100 тыс." },
];

const formatPercent = (value: number): string => `${value}%`;

const formatRubles = (value: number): string =>
  `${value.toLocaleString("ru-RU")} ₽`;

export const ToggleFieldsFormExample = () => {
  const [result, setResult] = useState<ToggleFieldsValues>();
  const form = useZodForm(toggleFieldsSchema, {
    defaultValues: {
      view: "compact",
      plan: "free",
      active: true,
      accepted: false,
      volume: 60,
      budget: [20_000, 60_000],
    },
  });

  return (
    <Card
      title="Переключатели"
      description="Segmented, radio, switch, слайдеры и обязательный checkbox"
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
          <SliderFormField<ToggleFieldsValues>
            name="volume"
            label="Громкость уведомлений"
            showValue
            formatValue={formatPercent}
          />
          <SliderFormField<ToggleFieldsValues>
            name="budget"
            label="Бюджет"
            max={100_000}
            step={5_000}
            formatValue={formatRubles}
            marks={BUDGET_MARKS}
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
