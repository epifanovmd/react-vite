import { GroupedSelect, Select } from "@shared/ui";
import { type FC, useState } from "react";

import { DemoCard, DemoField, DemoRow } from "../shared";
import { FRUITS } from "./select-demo-data";
import { SelectWithCustomFilter } from "./SelectWithCustomFilter";
import { SelectWithoutFilter } from "./SelectWithoutFilter";

export const CustomRendering: FC = () => {
  const [value, setValue] = useState<string>();

  return (
    <DemoCard
      title="Кастомный рендер"
      description="optionRender и filterOption с предикатом"
    >
      <div className="flex flex-col gap-4">
        <DemoRow columns={2}>
          <DemoField label="optionRender — иконка + цветной label">
            <Select
              options={FRUITS}
              value={value}
              onChange={setValue}
              placeholder="Выберите фрукт"
              optionRender={({ option, selected, focused }) => (
                <span
                  className={
                    selected
                      ? "text-orange-600 font-semibold"
                      : focused
                        ? "text-blue-600"
                        : undefined
                  }
                >
                  {option.value === "apple"
                    ? "🍎 "
                    : option.value === "banana"
                      ? "🍌 "
                      : option.value === "cherry"
                        ? "🍒 "
                        : option.value === "mango"
                          ? "🥭 "
                          : option.value === "orange"
                            ? "🍊 "
                            : option.value === "peach"
                              ? "🍑 "
                              : ""}
                  {String(option.label)}
                </span>
              )}
            />
          </DemoField>

          <DemoField label="optionRender в GroupedSelect">
            <GroupedSelect
              placeholder="Выберите"
              groups={[
                {
                  group: "Fruits",
                  options: [
                    { value: "apple", label: "Apple" },
                    { value: "banana", label: "Banana" },
                  ],
                },
                {
                  group: "Vegetables",
                  options: [
                    { value: "carrot", label: "Carrot" },
                    { value: "broccoli", label: "Broccoli" },
                  ],
                },
              ]}
              optionRender={({ option }) => (
                <span className="uppercase text-[10px] tracking-wider">
                  {String(option.label)}
                </span>
              )}
            />
          </DemoField>
        </DemoRow>

        <DemoRow columns={2}>
          <DemoField label="filterOption — поиск по коду или имени">
            <SelectWithCustomFilter />
          </DemoField>

          <DemoField label="filterOption=false — без фильтрации">
            <SelectWithoutFilter />
          </DemoField>
        </DemoRow>
      </div>
    </DemoCard>
  );
};
