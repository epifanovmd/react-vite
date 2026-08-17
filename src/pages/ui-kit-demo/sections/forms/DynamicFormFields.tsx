import {
  InputFormField,
  SegmentedFormField,
  SelectFormField,
  useFieldCondition,
  useRevalidateFields,
} from "@shared/ui";

import { type DynamicFormValues, dynamicRules } from "./dynamic-form-schema";

export const DynamicFormFields = () => {
  const inn = useFieldCondition<
    DynamicFormValues,
    "inn",
    readonly ["customerType", "country"]
  >({
    name: "inn",
    dependencies: ["customerType", "country"],
    when: ([customerType, country]) =>
      dynamicRules.innRequired(customerType, country),
    hiddenValue: "clear",
    clearValue: "",
  });
  const address = useFieldCondition<
    DynamicFormValues,
    "address",
    readonly ["delivery"]
  >({
    name: "address",
    dependencies: ["delivery"],
    when: ([delivery]) => dynamicRules.addressRequired(delivery),
    hiddenValue: "preserve",
  });

  useRevalidateFields<
    DynamicFormValues,
    readonly ["customerType", "country", "delivery"],
    readonly ["inn", "address"]
  >({
    dependencies: ["customerType", "country", "delivery"],
    targets: ["inn", "address"],
  });

  return (
    <>
      <SegmentedFormField<DynamicFormValues>
        name="customerType"
        label="Тип клиента"
        options={[
          { value: "person", label: "Физлицо" },
          { value: "company", label: "Компания" },
        ]}
      />
      <SelectFormField<DynamicFormValues>
        name="country"
        label="Страна"
        options={[
          { value: "RU", label: "Россия" },
          { value: "KZ", label: "Казахстан" },
        ]}
      />
      {inn.active && (
        <InputFormField<DynamicFormValues>
          name="inn"
          label="ИНН"
          description="Появляется только для компании из России"
          required={inn.required}
        />
      )}
      <SegmentedFormField<DynamicFormValues>
        name="delivery"
        label="Доставка"
        options={[
          { value: "pickup", label: "Самовывоз" },
          { value: "courier", label: "Курьер" },
        ]}
      />
      {address.active && (
        <InputFormField<DynamicFormValues>
          name="address"
          label="Адрес"
          required={address.required}
        />
      )}
    </>
  );
};
