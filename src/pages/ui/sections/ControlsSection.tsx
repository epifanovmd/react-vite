import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
} from "@components/ui";
import { FC, useState } from "react";

export const ControlsSection: FC = () => {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [plan, setPlan] = useState("pro");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Controls</CardTitle>
        <CardDescription className="text-xs">
          Switch и Checkbox — размеры, варианты состояния
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Switch sizes */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Switch — размеры</p>
          <div className="flex items-center gap-4 flex-wrap">
            {(["sm", "md", "lg"] as const).map(s => (
              <div key={s} className="flex items-center gap-2">
                <Switch
                  checked={switchChecked}
                  onCheckedChange={setSwitchChecked}
                  size={s}
                />
                <span className="text-xs">{s}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Switch variants */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">
            Switch — варианты
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Switch
                checked={switchChecked}
                onCheckedChange={setSwitchChecked}
              />
              <span className="text-xs">default</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={false}
                variant="error"
                onCheckedChange={() => {}}
              />
              <span className="text-xs">error</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={true}
                variant="success"
                onCheckedChange={() => {}}
              />
              <span className="text-xs">success</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={switchChecked}
                onCheckedChange={setSwitchChecked}
                disabled
              />
              <span className="text-xs">disabled</span>
            </div>
          </div>
        </div>
        {/* Checkbox sizes + indeterminate */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">
            Checkbox — размеры
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            {(["sm", "md", "lg"] as const).map(s => (
              <div key={s} className="flex items-center gap-2">
                <Checkbox
                  checked={checkboxChecked}
                  onCheckedChange={c => setCheckboxChecked(c as boolean)}
                  size={s}
                />
                <span className="text-xs">{s}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Checkbox indeterminate size="md" />
              <span className="text-xs">indeterminate</span>
            </div>
          </div>
        </div>
        {/* Checkbox variants */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">
            Checkbox — варианты
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={checkboxChecked}
                onCheckedChange={c => setCheckboxChecked(c as boolean)}
              />
              <span className="text-xs">default</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={false} variant="error" />
              <span className="text-xs">error</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={true} variant="success" />
              <span className="text-xs">success</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={checkboxChecked}
                onCheckedChange={c => setCheckboxChecked(c as boolean)}
                disabled
              />
              <span className="text-xs">disabled</span>
            </div>
          </div>
        </div>
        {/* Radio group */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">
            Radio — горизонтальная группа
          </p>
          <RadioGroup value={plan} onChange={setPlan} orientation="horizontal">
            <Radio value="free" label="Free" />
            <Radio value="pro" label="Pro" />
            <Radio value="team" label="Team" />
            <Radio value="enterprise" label="Enterprise" disabled />
          </RadioGroup>
        </div>
        {/* Radio with descriptions + variants */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">
            Radio — с описанием и состояниями
          </p>
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
        </div>
      </CardContent>
    </Card>
  );
};
