import { Select, useStaticOptions } from "@shared/ui";
import { type FC, useState } from "react";

import { FRUITS } from "./select-demo-data";

export const SelectWithoutFilter: FC = () => {
  const [value, setValue] = useState<string>();
  const data = useStaticOptions(FRUITS, {
    search: true,
    filterOption: false,
  });

  return (
    <div className="flex flex-col gap-1">
      <Select
        {...data}
        value={value}
        onChange={setValue}
        placeholder="Фильтрация отключена"
      />
      <p className="text-[10px] text-muted-foreground">
        search включён, но filterOption=false — список не фильтруется
      </p>
    </div>
  );
};
