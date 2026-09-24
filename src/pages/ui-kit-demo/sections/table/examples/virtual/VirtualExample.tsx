import { Table } from "@shared/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { useVirtualExample } from "./useVirtualExample";

export const VirtualExample: FC = () => {
  const { data, columns, features } = useVirtualExample();

  return (
    <ExampleCard
      title="Виртуализация строк"
      description={`virtual — ${data.length.toLocaleString("ru-RU")} строк, в DOM только видимое окно; высоту держат строки-распорки, шапка остаётся липкой.`}
    >
      <Table
        data={data}
        columns={columns}
        size="sm"
        features={features}
        virtual
        stickyHeader
        containerClassName="h-[480px] flex-none"
      />
    </ExampleCard>
  );
};
