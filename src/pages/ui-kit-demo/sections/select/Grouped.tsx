import { GroupedSelect } from "@shared/ui";
import { type FC, useState } from "react";

import { DemoCard } from "../shared";

export const Grouped: FC = () => {
  const [value, setValue] = useState<string>();

  return (
    <DemoCard
      title="Grouped"
      description="Опции, сгруппированные по категориям"
    >
      <div className="max-w-xs">
        <GroupedSelect
          value={value}
          onChange={setValue}
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
          placeholder="Grouped"
        />
      </div>
    </DemoCard>
  );
};
