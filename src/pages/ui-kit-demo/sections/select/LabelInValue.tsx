import { type LabeledValue, Select } from "@shared/ui";
import { type FC, useState } from "react";

import { DemoCard, DemoField } from "../shared";
import { FRUITS } from "./select-demo-data";

export const LabelInValue: FC = () => {
  const [labeledValue, setLabeledValue] = useState<LabeledValue<string> | null>(
    null,
  );

  return (
    <DemoCard
      title="labelInValue"
      description="onChange возвращает LabeledValue<V> с label/key/disabled"
    >
      <DemoField label="labelInValue — значение с меткой">
        <Select<string>
          options={FRUITS}
          labelInValue
          clearable
          value={labeledValue}
          onChange={(v: LabeledValue<string> | null) => setLabeledValue(v)}
          placeholder="Выберите фрукт"
        />
        <pre className="mt-1 rounded bg-muted p-2 text-[10px] overflow-x-auto">
          {JSON.stringify(labeledValue, null, 2)}
        </pre>
      </DemoField>
    </DemoCard>
  );
};
