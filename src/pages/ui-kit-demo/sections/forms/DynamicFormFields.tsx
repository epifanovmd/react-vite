import {
  InputFormField,
  SegmentedFormField,
  SelectFormField,
  SwitchFormField,
  useFormValue,
} from "@shared/ui";

import { type DynamicFormValues, isInnRequired } from "./dynamic-form-schema";

const CUSTOMER_TYPE_OPTIONS = [
  { value: "person", label: "Физлицо" },
  { value: "company", label: "Компания" },
];

const COUNTRY_OPTIONS = [
  { value: "RU", label: "Россия" },
  { value: "KZ", label: "Казахстан" },
];

export const DynamicFormFields = () => {
  const customerType = useFormValue<DynamicFormValues, "customerType">(
    "customerType",
  );
  const country = useFormValue<DynamicFormValues, "country">("country");
  const needsDelivery = useFormValue<DynamicFormValues, "needsDelivery">(
    "needsDelivery",
  );
  const showInn = isInnRequired(customerType, country);

  return (
    <>
      <SegmentedFormField<DynamicFormValues>
        name="customerType"
        label="Тип клиента"
        options={CUSTOMER_TYPE_OPTIONS}
      />
      <SelectFormField<DynamicFormValues>
        name="country"
        label="Страна"
        options={COUNTRY_OPTIONS}
      />
      {showInn && (
        <InputFormField<DynamicFormValues>
          name="inn"
          label="ИНН"
          description="Обязателен только для российской компании"
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
