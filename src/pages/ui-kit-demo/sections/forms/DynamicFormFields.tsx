import { InputFormField, SwitchFormField } from "@shared/ui";
import { useFormContext, useWatch } from "react-hook-form";

import type { DynamicFormValues } from "./dynamic-form-schema";

export const DynamicFormFields = () => {
  const { control } = useFormContext<DynamicFormValues>();
  const [hasInn, needsDelivery] = useWatch({
    control,
    name: ["hasInn", "needsDelivery"],
    exact: true,
  });

  return (
    <>
      <SwitchFormField<DynamicFormValues>
        name="hasInn"
        label="Указать ИНН"
        description="Переключатель выбирает ветку discriminated union"
      />
      {hasInn && (
        <InputFormField<DynamicFormValues>
          name="inn"
          label="ИНН"
          description="Поле существует и валидируется только в активной ветке"
          required
          shouldUnregister
        />
      )}

      <SwitchFormField<DynamicFormValues>
        name="needsDelivery"
        label="Нужна доставка"
        description="Независимая динамическая секция формы"
      />
      {needsDelivery && (
        <InputFormField<DynamicFormValues>
          name="address"
          label="Адрес доставки"
          required
          shouldUnregister
        />
      )}
    </>
  );
};
