import { Select, type SelectOption, useStaticOptions } from "@shared/ui";
import { type FC, useState } from "react";

import { DemoCard, DemoEmittedValue, DemoField, DemoRow } from "../shared";
import { delay } from "./select-demo-data";

const INITIAL_TAGS: SelectOption[] = [
  { value: "frontend", label: "frontend" },
  { value: "backend", label: "backend" },
  { value: "design", label: "design" },
  { value: "urgent", label: "urgent" },
];

const toTagValue = (query: string) => query.trim().toLowerCase();

export const Creatable: FC = () => {
  const [tags, setTags] = useState(INITIAL_TAGS);
  const [selectedTags, setSelectedTags] = useState<string[]>(["frontend"]);
  const [category, setCategory] = useState<string>();
  const [asyncTags, setAsyncTags] = useState<string[]>([]);

  const tagsData = useStaticOptions(tags, { search: true });
  const asyncData = useStaticOptions(tags, { search: true });

  const addTag = (query: string) => {
    const value = toTagValue(query);

    setTags(prev =>
      prev.some(tag => tag.value === value)
        ? prev
        : [...prev, { value, label: query.trim() }],
    );

    return value;
  };

  const addTagAsync = (query: string) => delay(query, 700).then(addTag);

  return (
    <DemoCard
      title="Создание опций (creatable)"
      description="Если поиск не совпадает ни с одной опцией точно — сверху появляется «Создать «…»»; onCreate добавляет опцию и возвращает значение"
    >
      <DemoRow columns={2}>
        <DemoField label="Multi: теги (sync onCreate)">
          <Select
            {...tagsData}
            multi
            clearable
            creatable
            onCreate={addTag}
            value={selectedTags}
            onChange={setSelectedTags}
            placeholder="Добавьте теги"
          />
          <DemoEmittedValue value={selectedTags.join(", ")} />
        </DemoField>

        <DemoField label="Single + кастомная подпись">
          <Select
            {...tagsData}
            creatable
            onCreate={addTag}
            createLabel={query => `Новая категория: ${query}`}
            value={category}
            onChange={setCategory}
            placeholder="Категория"
          />
          <DemoEmittedValue value={category ?? ""} />
        </DemoField>

        <DemoField label="Async onCreate (сохранение 700 мс)">
          <Select
            {...asyncData}
            multi
            creatable
            onCreate={addTagAsync}
            value={asyncTags}
            onChange={setAsyncTags}
            placeholder="Тег сохранится на «сервере»"
          />
          <DemoEmittedValue value={asyncTags.join(", ")} />
        </DemoField>
      </DemoRow>
    </DemoCard>
  );
};
