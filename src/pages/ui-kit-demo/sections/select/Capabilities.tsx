import { Select, useStaticOptions } from "@shared/ui";
import { type FC, useState } from "react";

import { DemoCard, DemoField, DemoRow } from "../shared";
import { FRUITS, MANY_TAGS } from "./select-demo-data";

export const Capabilities: FC = () => {
  const [basic, setBasic] = useState<string>();
  const [searchSingle, setSearchSingle] = useState<string>();
  const [clearable, setClearable] = useState<string | null>("option2");
  const [multi, setMulti] = useState<string[]>(["apple", "mango"]);
  const [multiComma, setMultiComma] = useState<string[]>(["apple", "orange"]);
  const [deselectedLog, setDeselectedLog] = useState<string[]>([]);
  const [focusCount, setFocusCount] = useState(0);
  const [blurCount, setBlurCount] = useState(0);

  const [multiSelect, setMultiSelect] = useState<string[]>(["apple"]);
  const [multiMax, setMultiMax] = useState<string[]>([]);

  const searchable = useStaticOptions(FRUITS, { search: true });
  const multiSearch = useStaticOptions(FRUITS, { search: true });

  return (
    <DemoCard
      title="Возможности"
      description="Поиск, очистка, мульти-выбор, колбэки"
    >
      <div className="flex flex-col gap-4">
        <DemoRow columns={2}>
          <DemoField label="Базовый (single)">
            <Select
              options={FRUITS}
              value={basic}
              onChange={setBasic}
              placeholder="Выберите фрукт"
            />
          </DemoField>

          <DemoField label="Clearable (крестик очистки)">
            <Select
              options={FRUITS}
              clearable
              value={clearable}
              onChange={setClearable}
              placeholder="Можно очистить"
            />
          </DemoField>

          <DemoField label="С поиском (single)">
            <Select
              {...searchable}
              value={searchSingle}
              onChange={setSearchSingle}
              placeholder="Печатайте для поиска"
            />
          </DemoField>

          <DemoField label="Disabled">
            <Select options={FRUITS} disabled placeholder="Недоступно" />
          </DemoField>
        </DemoRow>

        <DemoRow columns={2}>
          <DemoField label="Multi (теги)">
            <Select
              multi
              options={FRUITS}
              value={multi}
              onChange={setMulti}
              placeholder="Несколько значений"
            />
          </DemoField>

          <DemoField label="Multi + поиск + clearable">
            <Select
              {...multiSearch}
              multi
              clearable
              value={multi}
              onChange={setMulti}
              placeholder="Поиск по тегам"
            />
          </DemoField>

          <DemoField label="Multi без тегов (через запятую)">
            <Select
              multi
              tagsDisplay={false}
              options={FRUITS}
              value={multiComma}
              onChange={setMultiComma}
              placeholder="Список через запятую"
            />
          </DemoField>

          <DemoField label={`maxTagCount=3 (${MANY_TAGS.length} опций)`}>
            <Select
              multi
              maxTagCount={3}
              options={MANY_TAGS}
              value={multiMax}
              onChange={setMultiMax}
              placeholder="Ограничение тегов"
            />
          </DemoField>
        </DemoRow>

        <DemoRow columns={2}>
          <DemoField label="Loading">
            <Select options={[]} loading placeholder="Загрузка…" />
          </DemoField>

          <DemoField label="Empty (нет опций)">
            <Select
              options={[]}
              placeholder="Пусто"
              empty="Ничего не найдено"
            />
          </DemoField>
        </DemoRow>

        <DemoRow columns={2}>
          <DemoField label="onSelect / onDeselect (multi)">
            <Select
              multi
              clearable
              options={FRUITS}
              value={multiSelect}
              onChange={setMultiSelect}
              placeholder="Выберите фрукты"
              onSelect={(v, opt) => console.log("onSelect:", v, opt.label)}
              onDeselect={(v, opt) =>
                setDeselectedLog(prev => [...prev.slice(-4), `${opt.label} ×`])
              }
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              выбрано: {multiSelect.join(", ") || "—"} | deselect:{" "}
              {deselectedLog.length > 0 ? deselectedLog.join(", ") : "—"}
            </p>
          </DemoField>

          <DemoField label="onFocus / onBlur">
            <Select
              options={FRUITS}
              placeholder="Фокус / blur"
              onFocus={() => setFocusCount(c => c + 1)}
              onBlur={() => setBlurCount(c => c + 1)}
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              focus: {focusCount} | blur: {blurCount}
            </p>
          </DemoField>
        </DemoRow>
      </div>
    </DemoCard>
  );
};
