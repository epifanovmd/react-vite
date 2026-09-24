import { Select } from "@shared/ui";
import { type FC } from "react";

import { DemoCard, DemoField } from "../shared";

const BASIC = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export const Appearance: FC = () => (
  <DemoCard title="Внешний вид" description="Варианты состояния и размеры">
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 items-start">
        {(
          [
            "default",
            "filled",
            "filled-error",
            "filled-success",
            "error",
            "success",
          ] as const
        ).map(variant => (
          <DemoField key={variant} label={variant}>
            <Select options={BASIC} placeholder={variant} variant={variant} />
          </DemoField>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 items-start">
        {(["sm", "md", "lg"] as const).map(size => (
          <DemoField key={size} label={`size: ${size}`}>
            <Select options={BASIC} placeholder={size} size={size} />
          </DemoField>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 items-start">
        <DemoField label="valid (успех)">
          <Select options={BASIC} placeholder="Валидно" valid />
        </DemoField>
        <DemoField label="valid (ошибка)">
          <Select options={BASIC} placeholder="Ошибка" valid={false} />
        </DemoField>
      </div>
    </div>
  </DemoCard>
);
