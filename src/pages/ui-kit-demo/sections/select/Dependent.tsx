import { Select, useDependentOptions } from "@shared/ui";
import { type FC, useState } from "react";

import { DemoCard, DemoField, DemoRow } from "../shared";
import { delay } from "./select-demo-data";

const DEPENDENT_DATA: Record<string, string[]> = {
  electronics: ["Смартфоны", "Ноутбуки", "Наушники", "Зарядки"],
  clothing: ["Футболки", "Джинсы", "Куртки", "Обувь"],
  books: ["Художественная", "Техническая", "Детская"],
};

export const Dependent: FC = () => {
  const [category, setCategory] = useState<string>();
  const [subcategory, setSubcategory] = useState<string>();

  const subs = useDependentOptions({
    dependsOn: category,
    fetch: (cat: string) =>
      delay(DEPENDENT_DATA[cat as keyof typeof DEPENDENT_DATA] ?? [], 500),
    getOption: (item: string) => ({ value: item, label: item }),
  });

  const handleCategoryChange = (cat: string | null) => {
    setCategory(cat ?? undefined);
    setSubcategory(undefined);
  };

  return (
    <DemoCard
      title="Зависимые опции"
      description="useDependentOptions — выбор категории влияет на список подкатегорий"
    >
      <div className="flex flex-col gap-3">
        <DemoRow columns={2}>
          <DemoField label="Категория">
            <Select
              options={[
                { value: "electronics", label: "Электроника" },
                { value: "clothing", label: "Одежда" },
                { value: "books", label: "Книги" },
              ]}
              value={category}
              onChange={handleCategoryChange}
              clearable
              placeholder="Выберите категорию"
            />
          </DemoField>

          <DemoField label="Подкатегория (+ hideEmpty)">
            <Select
              {...subs}
              value={subcategory}
              onChange={setSubcategory}
              hideEmpty
              placeholder={
                !category
                  ? "Сначала выберите категорию"
                  : subs.loading
                    ? "Загрузка..."
                    : "Выберите подкатегорию"
              }
            />
          </DemoField>
        </DemoRow>
        <p className="text-[10px] text-muted-foreground">
          {!category
            ? "Выберите категорию, чтобы загрузить подкатегории"
            : subs.loading
              ? "Загрузка..."
              : `Загружено ${(subs.options ?? []).length} подкатегорий`}
        </p>
      </div>
    </DemoCard>
  );
};
