import { GroupedSelect, Select, useStaticOptions } from "@shared/ui";
import { type FC, useState } from "react";

import { DemoCard, DemoEmittedValue, DemoField, DemoRow } from "../shared";
import { MANY_OPTION_GROUPS, MANY_OPTIONS } from "./select-demo-data";

export const VirtualOptions: FC = () => {
  const [single, setSingle] = useState<string>();
  const [multi, setMulti] = useState<string[]>([]);
  const [grouped, setGrouped] = useState<string>();

  const searchable = useStaticOptions(MANY_OPTIONS, { search: true });

  return (
    <DemoCard
      title="Виртуализация (virtual)"
      description={`${MANY_OPTIONS.length.toLocaleString("ru")} опций: в DOM только видимые, клавиатура прокручивает список к активной опции`}
    >
      <DemoRow columns={3}>
        <DemoField label="Single + поиск">
          <Select
            {...searchable}
            virtual
            value={single}
            onChange={setSingle}
            placeholder="Найдите опцию"
          />
          <DemoEmittedValue value={single ?? ""} />
        </DemoField>

        <DemoField label="Multi, overscan=12">
          <Select
            multi
            virtual={{ overscan: 12 }}
            options={MANY_OPTIONS}
            value={multi}
            onChange={setMulti}
            maxTagCount={2}
            placeholder="Несколько опций"
          />
        </DemoField>

        <DemoField label="Группы — заголовки строками списка">
          <GroupedSelect
            virtual
            groups={MANY_OPTION_GROUPS}
            value={grouped}
            onChange={setGrouped}
            placeholder="Опция из группы"
          />
        </DemoField>
      </DemoRow>
    </DemoCard>
  );
};
