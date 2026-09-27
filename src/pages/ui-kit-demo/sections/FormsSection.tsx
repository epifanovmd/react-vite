import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui";
import { type ComponentType, type FC } from "react";

import {
  AsyncValidationExample,
  ChoiceFieldsFormExample,
  DateFieldsFormExample,
  DynamicFormExample,
  FieldArrayExample,
  TextFieldsFormExample,
  ToggleFieldsFormExample,
} from "./forms";

interface FormExample {
  value: string;
  label: string;
  Component: ComponentType;
}

const FORM_EXAMPLES: FormExample[] = [
  { value: "text", label: "Текст", Component: TextFieldsFormExample },
  { value: "choice", label: "Выбор", Component: ChoiceFieldsFormExample },
  {
    value: "toggles",
    label: "Переключатели",
    Component: ToggleFieldsFormExample,
  },
  { value: "dates", label: "Даты", Component: DateFieldsFormExample },
  {
    value: "dynamic",
    label: "Зависимые поля",
    Component: DynamicFormExample,
  },
  {
    value: "async",
    label: "Async validation",
    Component: AsyncValidationExample,
  },
  {
    value: "array",
    label: "Массив полей",
    Component: FieldArrayExample,
  },
];

export const FormsSection: FC = () => (
  <Tabs defaultValue={FORM_EXAMPLES[0]!.value} className="min-w-0">
    <TabsList
      variant="underline"
      size="sm"
      className="w-full justify-start overflow-x-auto"
    >
      {FORM_EXAMPLES.map(({ value, label }) => (
        <TabsTrigger key={value} value={value} variant="underline" size="sm">
          {label}
        </TabsTrigger>
      ))}
    </TabsList>

    {FORM_EXAMPLES.map(({ value, Component }) => (
      <TabsContent key={value} value={value} className="pt-4">
        <Component />
      </TabsContent>
    ))}
  </Tabs>
);
