import { Checkbox, Radio, RadioGroup, Separator, Switch } from "@shared/ui";
import { type FC, useState } from "react";

import { DemoBlock, DemoCard, DemoField, DemoInline } from "./shared";

const SIZES = ["sm", "md", "lg"] as const;

const noop = () => {};

export const ControlsSection: FC = () => {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [plan, setPlan] = useState("pro");

  const handleCheckboxChange = (checked: boolean | "indeterminate") =>
    setCheckboxChecked(checked === true);

  return (
    <DemoCard
      title="Переключатели"
      description="Switch, Checkbox, Radio — размеры и варианты"
    >
      <DemoBlock title="Switch">
        <DemoField label="Размеры">
          <DemoInline spacing="loose">
            {SIZES.map(size => (
              <Switch
                key={size}
                size={size}
                label={size}
                checked={switchChecked}
                onCheckedChange={setSwitchChecked}
              />
            ))}
          </DemoInline>
        </DemoField>
        <DemoField label="С подписью и описанием">
          <Switch
            checked={switchChecked}
            onCheckedChange={setSwitchChecked}
            label="Уведомления"
            description="Письма о новых событиях в проекте"
          />
        </DemoField>
        <DemoField label="Варианты">
          <DemoInline spacing="loose">
            <Switch
              label="default"
              checked={switchChecked}
              onCheckedChange={setSwitchChecked}
            />
            <Switch
              label="error"
              variant="error"
              checked={false}
              onCheckedChange={noop}
            />
            <Switch
              label="success"
              variant="success"
              checked
              onCheckedChange={noop}
            />
            <Switch
              label="disabled"
              checked={switchChecked}
              onCheckedChange={setSwitchChecked}
              disabled
            />
          </DemoInline>
        </DemoField>
      </DemoBlock>

      <Separator />

      <DemoBlock title="Checkbox">
        <DemoField label="Размеры">
          <DemoInline spacing="loose">
            {SIZES.map(size => (
              <Checkbox
                key={size}
                size={size}
                label={size}
                checked={checkboxChecked}
                onCheckedChange={handleCheckboxChange}
              />
            ))}
            <Checkbox indeterminate label="indeterminate" />
          </DemoInline>
        </DemoField>
        <DemoField label="С подписью и описанием">
          <Checkbox
            checked={checkboxChecked}
            onCheckedChange={handleCheckboxChange}
            label="Принимаю условия"
            description="Соглашение и политика обработки данных"
          />
        </DemoField>
        <DemoField label="Варианты">
          <DemoInline spacing="loose">
            <Checkbox
              label="default"
              checked={checkboxChecked}
              onCheckedChange={handleCheckboxChange}
            />
            <Checkbox label="error" variant="error" checked={false} />
            <Checkbox label="success" variant="success" checked />
            <Checkbox
              label="disabled"
              checked={checkboxChecked}
              onCheckedChange={handleCheckboxChange}
              disabled
            />
          </DemoInline>
        </DemoField>
      </DemoBlock>

      <Separator />

      <DemoBlock title="Radio">
        <DemoField label="Горизонтальная группа">
          <RadioGroup
            value={plan}
            onValueChange={setPlan}
            orientation="horizontal"
          >
            <Radio value="free" label="Free" />
            <Radio value="pro" label="Pro" />
            <Radio value="team" label="Team" />
            <Radio value="enterprise" label="Enterprise" disabled />
          </RadioGroup>
        </DemoField>
        <DemoField label="С описанием и состояниями">
          <RadioGroup defaultValue="b" className="gap-3">
            <Radio
              value="a"
              label="Стандартный"
              description="Обычный вариант выбора"
            />
            <Radio
              value="b"
              variant="success"
              label="Успех"
              description="Вариант с зелёным акцентом"
            />
            <Radio
              value="c"
              variant="error"
              label="Ошибка"
              description="Вариант с красным акцентом"
            />
          </RadioGroup>
        </DemoField>
      </DemoBlock>
    </DemoCard>
  );
};
