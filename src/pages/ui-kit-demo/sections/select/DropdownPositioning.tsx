import { Select } from "@shared/ui";
import { type FC, useState } from "react";

import { DemoCard, DemoField, DemoRow } from "../shared";
import { FRUITS } from "./select-demo-data";

const LONG_OPTIONS = [
  { value: "opt1", label: "Производство электрооборудования" },
  { value: "opt2", label: "Оптовая торговля стройматериалами" },
  { value: "opt3", label: "Деятельность в области информационных технологий" },
];

const SIDES = ["bottom", "top", "left", "right"] as const;

const ALIGNS = ["start", "center", "end"] as const;

export const DropdownPositioning: FC = () => {
  const [v1, setV1] = useState<string>();
  const [v2, setV2] = useState<string>();
  const [v3, setV3] = useState<string>();
  const [v4, setV4] = useState<string>();
  const [v5, setV5] = useState<string>();

  return (
    <DemoCard
      title="Позиционирование дропдауна"
      description="dropdownSide, dropdownAlign, dropdownWidth, dropdownMaxWidth"
    >
      <div className="flex flex-col gap-4">
        <p className="text-xs text-muted-foreground font-medium">
          dropdownSide — все 4 стороны
        </p>
        <DemoRow columns={2}>
          {SIDES.map(side => (
            <DemoField key={side} label={`dropdownSide="${side}"`}>
              <Select
                options={FRUITS}
                value={v1}
                onChange={setV1}
                placeholder={side}
                dropdownSide={side}
                dropdownWidth="auto"
                dropdownCollisionPadding={8}
              />
            </DemoField>
          ))}
        </DemoRow>

        <p className="text-xs text-muted-foreground font-medium">
          dropdownAlign — длинные опции, дропдаун шире триггера
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          {ALIGNS.map(align => (
            <div key={align} className="max-w-[140px]">
              <DemoField label={`dropdownAlign="${align}"`}>
                <Select
                  options={LONG_OPTIONS}
                  value={v2}
                  onChange={setV2}
                  placeholder={align}
                  dropdownSide="bottom"
                  dropdownAlign={align}
                  dropdownWidth="auto"
                  dropdownCollisionPadding={8}
                />
              </DemoField>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground font-medium">
          dropdownWidth — варианты ширины
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
          <DemoField label='dropdownWidth="trigger" (default)'>
            <Select
              options={FRUITS}
              value={v3}
              onChange={setV3}
              placeholder="Как триггер"
            />
          </DemoField>
          <DemoField label='dropdownWidth="auto" — короткие опции'>
            <Select
              options={FRUITS}
              value={v4}
              onChange={setV4}
              placeholder="По контенту"
              dropdownWidth="auto"
            />
          </DemoField>
          <DemoField label='dropdownWidth="auto" — длинные опции'>
            <Select
              options={LONG_OPTIONS}
              placeholder="По контенту"
              dropdownWidth="auto"
            />
          </DemoField>
          <DemoField label="dropdownWidth={280} — фикс 280px">
            <Select
              options={FRUITS}
              value={v5}
              onChange={setV5}
              placeholder="Фиксированная ширина"
              dropdownWidth={280}
            />
          </DemoField>
          <DemoField label="dropdownMaxWidth={160} — максимум 160px">
            <Select
              options={FRUITS}
              placeholder="Узкий максимум"
              dropdownWidth="auto"
              dropdownMaxWidth={160}
            />
          </DemoField>
        </div>
      </div>
    </DemoCard>
  );
};
